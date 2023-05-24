import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand} from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

// Importación de módulos necesarios para interactuar con DynamoDB

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const eliminarVideojuego = async (event, context) => {
  const id = event.pathParameters.id;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    // Verificar si el videojuego existe antes de eliminarlo
    const result = await dynamo.send(
      new GetCommand({
        TableName: "VideojuegoTable",
        Key: { id: id },
      })
    );

    const VideoJuegoExiste = result.Item;
    if (!VideoJuegoExiste) {
      throw new createError.NotFound(`Videojuego con id: ${id} no encontrado`);
    }

    // Eliminar el videojuego
    await dynamo.send(
      new DeleteCommand({
        TableName: "VideojuegoTable",
        Key: { id: id },
      })
    );

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: `Videojuego con id: ${id} eliminado correctamente` })
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(eliminarVideojuego);
