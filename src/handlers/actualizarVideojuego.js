import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand,PutCommand} from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";


// Importación de módulos necesarios para interactuar con DynamoDB

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const actualizarVideojuego = async(event, context) => {
       let VideoJuegoExiste;

    const id  = event.pathParameters.id;

    const VideojuegoActualizar = event.body;

    const updatedVideojuego = {
        ...VideojuegoActualizar,
        id: id,
    };

    const headers = {
        'Content-Type': 'aplication/json',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        
        const result = await dynamo.send(
            new GetCommand({
            TableName: "VideojuegoTable",
            Key: { id : id },
        }
    ));

        VideoJuegoExiste = result.Item;
    }
    catch(error) {
        console.error(error);    
           throw new createError.InternalServerError(error);
    }

    if (!VideoJuegoExiste) {
        throw new createError.NotFound(`Videojuego con id: ${id} no encontrado`);
    }

    await dynamo.send(
        new PutCommand({
        TableName: "VideojuegoTable",
        Item: updatedVideojuego
    }
));
    return  { 
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(updatedVideojuego)
    };
    

};

 
export const handler = commonMiddleware(actualizarVideojuego);


