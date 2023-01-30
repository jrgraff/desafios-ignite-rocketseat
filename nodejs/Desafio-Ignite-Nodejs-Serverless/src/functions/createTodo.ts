import { APIGatewayEvent } from "aws-lambda";
import { v4 as uuid } from "uuid"
import { document } from '../utils/dynamodbClient';

interface ICreateTodo{
    title: string;
    deadline: string;
}

export const handle = async (event: APIGatewayEvent) => {
    const { userId } = event.pathParameters;

    const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

    const todoId = uuid();

    await document.put({
        TableName: "todos",
        Item: {
            id: todoId,
            userId,
            title,
            done: false,
            deadline: new Date(deadline),
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo created!",
            todo: {
                id: todoId,
                userId,
                title,
                done: false,
                deadline,
            },
        }),
        headers: {
            "Content-Type": "application/json",
        },
    };
}