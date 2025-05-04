const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  console.info('Method:', request.method)
  console.info('Path:  ', request.path)
  if (!request.path.includes('/login')) {
    console.info('Body:  ', request.body)
  }
  console.info('---------------------------------------------------FIM')
  next()
}

const unknownEndpoint = (request, response) => {
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

const userExtractor = (request, response, next) => {
  console.info('Method:', request.method)
  if (request.method === 'OPTIONS') {
    // Nas solicitudes complexas a primeira solicitude é a de OPTIONS, e a resposta está baleira, nom vai o token
    // Se o servidor constesta positivamente o navegador envia a solicitude seguinte já cos headers.
    return next()
  }

  console.log('process.env.NODE_ENTORNO: ' + process.env.NODE_ENTORNO
    , '  |  process.env.QUAL_PROJECTO: ' + process.env.QUAL_PROJECTO);
  if (process.env.NODE_ENTORNO === 'railway') {
    const authorization = request.get('authorization') || request.get('Authorization');
    console.log('authorization: ' + authorization);
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token  = authorization.replace('Bearer ', '')
      console.log('request.token: ' + request.token);

      let decodedToken
      try {
        decodedToken = jwt.verify(request.token, process.env.SEGREDO_PARA_O_TOKEN)
        if (!decodedToken.id) {
          return response.status(401).json({ error: 'token invalid' })
        } else {
          // console.log('decodedToken: ', decodedToken);
          // console.log('decodedToken.id: ', decodedToken.id);
          // console.log('decodedToken.nome: ', decodedToken.nome);
          // console.log('decodedToken.idioma: ', decodedToken.idioma);
          request.idUsuario = decodedToken.id
        }
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

module.exports = {
  requestLogger,
  unknownEndpoint,
  //tokenExtractor,
  userExtractor,
  errorHandler
}