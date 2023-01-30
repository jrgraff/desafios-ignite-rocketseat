import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';
import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadMore(): Promise<void> {
    setLoadingMore(true);

    const response = await fetch(nextPage);
    const data = await response.json();
    setPosts(prevState => [...prevState, ...data.results]);
    setNextPage(data.next_page);

    setLoadingMore(false);
  }

  return (
    <>
      <Head>
        <title>Posts | spacetraveling.</title>
      </Head>

      <Header />

      <main className={styles.container}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a>
              <strong>{post.data.title}</strong>

              <p>{post.data.subtitle}</p>
              <div className={commonStyles.info}>
                <FiCalendar />
                <time>
                  {format(new Date(post.first_publication_date), 'd MMM y', {
                    locale: ptBR,
                  })}
                </time>
                <FiUser />
                <p>{post.data.author}</p>
              </div>
            </a>
          </Link>
        ))}
        {nextPage && (
          <button
            type="button"
            className={styles.loadMore}
            onClick={loadMore}
            disabled={loadingMore}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 5,
    }
  );

  const { next_page } = postsResponse;

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: String(post.data.title),
        subtitle: String(post.data.subtitle),
        author: String(post.data.author),
      },
      first_publication_date: post.first_publication_date,
    };
  });

  return {
    props: { postsPagination: { results, next_page } },
  };
};
