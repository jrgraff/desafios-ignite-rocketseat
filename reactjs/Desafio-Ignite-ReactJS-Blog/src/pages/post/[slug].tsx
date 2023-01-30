import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { ParsedUrlQuery } from 'querystring';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import Head from 'next/head';

import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          {router.isFallback ? 'Carregando...' : post.data.title} |
          SpaceTraveling
        </title>
      </Head>
      <Header />
      {router.isFallback ? (
        'Carregando...'
      ) : (
        <>
          <img
            className={styles.header}
            src={post.data.banner.url}
            alt="banner"
          />
          <article className={styles.container}>
            <h1>{post.data.title}</h1>
            <div className={commonStyles.info}>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'd MMM y', {
                  locale: ptBR,
                })}
              </time>
              <FiUser />
              <p>{post.data.author}</p>
              <FiClock />
              <p>4 min</p>
            </div>

            {post.data.content.map(content => {
              return (
                <div className={styles.content} key={content.heading}>
                  <h2>{content.heading}</h2>
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(content.body),
                    }}
                  />
                </div>
              );
            })}
          </article>
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const { results } = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.uid'],
      pageSize: 1,
    }
  );

  return {
    paths: results.map(result => ({
      params: {
        slug: result.uid,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as Params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
