const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');




// Mensajes de Sockets
io.on('connection',  client => {
    console.log('Cliente conectado');

    // console.log(client.handshake.headers['x-token']);

    const [ valido, uid] = comprobarJWT( client.handshake.headers['x-token']);

    //Verificar autenticacion
    if (!valido){ return client.disconnect();}

    //Cliente autenticado
    usuarioConectado( uid );

    // Ingresar al usuario a una sala en particular
    // Sala global, client.id, 
    client.join( uid );

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
      //TODO: Grabar mensaje
     await grabarMensaje( payload );

      io.to( payload.para ).emit('mensaje-personal', payload);
    })

    

    // Cliente con websocket
    
    client.on('disconnect', () => { 
      usuarioDesconectado( uid );
      console.log('Cliente desconectado');
     });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit('mensaje', { admin: 'Nuevo mensaje'});
    // });

    // client.on('vote-band', ( payload ) => {
    //     bands.voteBand(payload.id);
    //     io.emit('active-bands', bands.getBands());
    // });
    // client.on('add-band', ( payload ) => {
    //     const newBand = new Band( payload.name);
    //     bands.addBand(newBand);
    //     io.emit('active-bands', bands.getBands());
    // });
    // client.on('delete-band', ( payload ) => {
    //     bands.deleteBand(payload.id);
    //     io.emit('active-bands', bands.getBands());
    // });
  });
