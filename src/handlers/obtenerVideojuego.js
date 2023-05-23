import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand} from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";


// Importación de módulos necesarios para interactuar con DynamoDB

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const obtenerVideojuego = async(event, context) => {
    let videojuego;
    const { id } = event.pathParameters;

    const headers = {
        'Content-Type': 'aplication/json',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        
        const result = await dynamo.send(new GetCommand({
            TableName: "VideojuegoTable",
            Key: { id } 
        }));

        videojuego = result.Item;
    }
    catch(error) {
        console.error(error);    
           throw new createError.InternalServerError(error);
    }

    if (!videojuego) {
        throw new createError.NotFound(`Videojuego con id: ${id} no encontrado`);
    }

    return  { 
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(videojuego)
    };
    

};

export const handler = commonMiddleware(obtenerVideojuego);
