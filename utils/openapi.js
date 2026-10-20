import swaggerJsdoc from 'swagger-jsdoc';

const setConfiguracom = (port) => {
    // Configuraçom de OpenAPI / Swagger      http://localhost:5002/api-docs
    
  const opcionsSwagger = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'A minha API em Node 20 com OpenAPI',
        version: '1.0.0',
        description: 'Documentaçom automatizada da minha API',
        },
        components: {
        securitySchemes: {
            // // Para que permita ponher o token
            // BearerAuth: {
            //   type: 'http',
            //   scheme: 'bearer',
            //   bearerFormat: 'JWT', // Opcional, indica que usamos un token JWT
            //   description: 'Insire o teu token JWT directamente (sem a palabra "Bearer")'
            // }
            OAuth2PasswordAuth: {
            type: 'oauth2',
            description: 'Insire o teu usuario e contrasinal para obter o token automaticamente',
            flows: {
                password: {
                // ⚠️ AQUÍ A CLAVE: A URL de produción ou local onde fas o login (POST)
                tokenUrl: `http://localhost:${port}/api/Usuarios`, 
                scopes: {
                    // Podes deixalo baleiro se non usas roles baseados en scopes
                    'ler': 'Permite ler datos',
                    'escreber': 'Permite escribir datos'
                }
                }
            }
            }
        }
        },
        // security: [{ BearerAuth: [] }],        // Para que todas as rutas da API pidam o token por defecto, sem ter que ponher en cada umha   - BearerAuth: []
        security: [{ OAuth2PasswordAuth: [] }],   // Para que todas as rutas da API pidam o token por defecto, sem ter que ponher en cada umha   - BearerAuth: []
        servers: [{ url: `http://localhost:${port}/api`}, { url: 'https://osteuslivrosnodejs.onrender.com/api'}],
    },
    apis: ['./routes/angular/*.js'], // Rotas onde o paquete buscará os teus comentarios de documentación
  };
  const swaggerDocs = swaggerJsdoc(opcionsSwagger);
  const uiOptions = {
    swaggerOptions: {
        docExpansion: 'none', // 'list' | 'full' | 'none'  com none todas as listas aparecem colapsadas
        tagsSorter: 'alpha', // Ordena as secçons (tags) alfabeticamente
        // operationsSorter: 'alpha' // ordena também os endpoints dentro de cada secçom alfabeticamente
        persistAuthorization: true,  // para que ao recarregar a página nom se perda o token
        
    },
    customCss: '.scope-def { display: none !important; }' // Para que nom apareza um texto da cabeceira da janela de autentificaçom
  };

  return { swaggerDocs, uiOptions };
}

export default {
    setConfiguracom
};