import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand} from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

// Importación de módulos necesarios para interactuar con DynamoDB

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const listarVideojuegos = async(event, context) => {
    try {
        let videojuegos;

        const result = await dynamo.send(new ScanCommand({
            TableName: "VideojuegoTable"
        }));

        videojuegos = result.Items;
    

    const headers = {
        'Content-Type': 'aplication/json',
        'Access-Control-Allow-Origin': '*'
    };
    

    return  { 
        statusCode: 201,
        headers: headers,
        body: JSON.stringify(videojuegos)
    };
    

   } catch(error) {
    console.error(error);    
       throw new createError.InternalServerError(error);
    }
};

export const handler = commonMiddleware(listarVideojuegos);
