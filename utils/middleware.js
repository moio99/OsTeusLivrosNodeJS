import jwt from 'jsonwebtoken';

const requestLogger = (request, response, next) => {
  console.info('Method:', request.method)
  console.info('Path:  ', request.path)
  if (!request.path.includes('/Usuarios') && process.env.NODE_ENTORNO === 'local') {
    console.info('Body:  ', request.body)
  }
  console.info('---------------------------------------------------FIM')
  next()
}

const unknownEndpoint = (request, response) => {
  if (process.env.NODE_ENTORNO === 'local')
    response.status(404).send({ error: 'O endpoint nom é conhecido' })
  else
    response.status(404).send({ error: 'unknown endpoint' })
}

/* const tokenExtractor = (request, response, next) => {
  console.log('process.env.MODOdd: ' + process.env.MODO);
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
} */

const controlUsuario = (request, response, next) => {
  console.info('Method:', request.method)
  if (request.method === 'OPTIONS') {
    // Nas solicitudes complexas a primeira solicitude é a de OPTIONS, e a resposta está baleira, nom vai o token
    // Se o servidor constesta positivamente o navegador envia a solicitude seguinte já cos headers.
    return next()
  }

  console.log('process.env.NODE_ENTORNO: ' + process.env.NODE_ENTORNO
       , '  |  process.env.QUAL_SQL: ' + process.env.QUAL_SQL);
  if (process.env.NODE_ENTORNO !== 'local' && request.originalUrl !== '/api/Outros/Idiomas') {
    const authorization = request.get('authorization') || request.get('Authorization');
    console.log('authorization: ' + authorization);
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '')
      // console.log('token: ' + token);

      try {
        jwt.verify(token, process.env.SEGREDO_PARA_O_TOKEN, (err, decodedToken) => {
          if (err) {
            // Se o token expirou, err.name será 'TokenExpiredError'
            console.error(err.name);
            return res.status(403).json({ error: 'Token inválido ou expirado' });
          }
          
          if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
          } else {
            // console.log('decodedToken: ', decodedToken);
            // console.log('decodedToken.id: ', decodedToken.id);
            // console.log('decodedToken.nome: ', decodedToken.nome);
            // console.log('decodedToken.idioma: ', decodedToken.idioma);
            request.idUsuario = decodedToken.id
          }
        });
      } catch(exception) {
        return response.status(401).json({ error: 'invalid signature' })
      }
    }
    else {
      return response.status(401).json({ error: 'token missing' })
    }
  } else {
    request.idUsuario = 2    // Se nom estou no entorno de railway, o id do usuario vai ser o 2
  }
  next()
}

const errorHandler = (error, request, response, next) => {

  logger.error('errorHandler', error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else {
    logger.error('Error type: other')
    logger.error(error.message)
  }

  next(error)
}

export default {
  requestLogger,
  unknownEndpoint,
  //tokenExtractor,
  controlUsuario,
  errorHandler
}