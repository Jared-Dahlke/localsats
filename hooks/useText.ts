import { useRouter } from 'next/router'

export const useText = () => {
	const { locale } = useRouter()
	return locale === 'en' ? english : spanish
}

const english = {
	home: 'Home',
	about: 'About',
	profile: 'Profile',
	welcome: 'Welcome',
	amount: 'Amount',
	postedAt: 'Posted At',
	type: 'Type',
	pgpPassphrase: 'PGP Passphrase',
	yourMessages: 'Your Messages',
	yourPgpPassphrase: 'Your PGP Passphrase...',
	new: 'New',
	youHaveANewMessage: 'You have a new message',
	signIntoYourAccount: 'Sign into your account',
	noWalletTry: 'No wallet? Try one of these',
	youHaveActivePosts: 'You have active posts',
	generateNewPgp: 'Generate new PGP key pair',
	generateANewKeyPair:
		'2. Generate a new keypair, you will be able to read all future messages, but this will prevent you from decrypting old messages',
	getYourPassphraseFromTheFirstDevice:
		'1. (Recommended) Get your passphrase from the first device you logged into with this account and save it in the input field below. This will allow you to decrypt old messages and future messages.',
	weHaveARecordOfYourPgp:
		'We have a record of your PGP public and private keys, but your auto-generated passphrase is not found in your cookies. You have 2 options:',
	emailUpdated: 'Email updated',
	attentionNeededInOrderToDecrypt:
		'Attention needed in order to decrypt future messages',
	yourPosts: 'Your Posts',
	paymentSuccess: 'Payment Success!',
	yourPostIsActive: 'Your post is active',
	showOnlyYourPosts: 'Show only your posts',
	learnMoreAboutLightningLogin: 'learn more about Lightning login',
	toCreateANewPostToBuyOrSell:
		'To create a new post to buy or sell bitcoin, just click anywhere on the map. To see other peoples posts, click on the icons on the map.',
	emailSettings: 'Email Settings',
	ifYoudLikeToReceiveAnEmailWhenSomeone:
		"If you'd like to receive an email when someone messages you, add an email here. Otherwise you can just check back later to see if you have any messages. We will not share your email with anyone.",
	optional: 'optional',
	save: 'save',
	yourMessagesAre: 'Your Messages are end-to-end encrypted using PGP',
	belowIsThePassphrase:
		'Below is the passphrase to your PGP keys that encrypt your messages. This is stored in your browser as a cookie. Save it somewhere safe in case you clear your cookies or you want to access your messages from another device.',
	yourMessage: 'Your Messages',
	postId: 'POST ID',
	otherParty: 'Other Party',
	latestMessage: 'Latest Message',
	open: 'Open',
	createANewPost: 'Create a new post',
	buy: 'Buy',
	sell: 'Sell',
	meetAt: 'meet at',
	latitude: 'latitude',
	longitude: 'longitude',
	create: 'Create',
	user: 'User',
	wantsToBuy: 'wants to buy',
	wantsToSell: 'wants to sell',
	posted: 'Posted',
	chatWithThisUser: 'Chat with this user',
	youAlreadyHaveAnOpenChat: 'You already have an open chat for this post',
	openChatWithUser: 'Open Chat With User',
	thisIsYourPost: 'This is your post',
	delete: 'Delete',
	daysLive: 'Days LocalSats.org has been Live',
	totalPosts: 'Total Posts',
	totalUsers: 'Total Users',
	totalMessages: 'Total Messages (encrypted)',
	frequentlyAskedQ: 'Frequently Asked Questions',
	cantFindTheAnswer: 'Can’t find the answer you’re looking for? Reach out to',
	whatIsThis: 'What is this?',
	itIsAnEasyWayToBuy:
		'It is an easy way to buy and sell bitcoin locally. Just create a post to either buy or sell bitcoin, then wait for someone to respond. Once someone responds, you will see their message on the home page. Additionally, you can add an email address to receive an email when someone responds to your post. We will never share your email with anyone. From there, you can use the chat to arrange a time to meet and buy/sell your bitcoin.',
	whatDataDoYouStore: 'What data do you store?',
	weStoreTheEncrypted:
		'We store the encrypted messages and posts associated with your LNURL-Auth address. If you choose to add an email address for notifications, we will store that as well. When you delete a post, that post and all of its associated messages are permanently deleted as well. If you choose to remove your email, that is permanently deleted as well.',
	dumpAllOfTheSite:
		'Dump all of the site data (except emails and messages) into a JSON file:',
	download: 'Download',
	whatIsTheTechStack: 'What is the tech stack for this site?',
	loginUsesLnurlAuth:
		'Login uses LNURL-auth. The frontend is built with Next.js and Tailwind CSS. The database is MongoDB. The email service is hosted on AWS. The site is hosted on Vercel.',
	howDoIContribute: 'How do I contribute?',
	IdeasContributorsAreWelcome:
		'Ideas and contributions are welcome! Here is the github:',
	feelFreeTomakeAPr:
		'Feel free to make a PR or open an issue. My email is jared.dahlke@protonmail.com if you have any questions.',
	signOut: 'Sign Out',
	yourUserIdFromLnurl: 'Your User ID from LNURL-auth:',
	buyAndSellBitcoinInPerson: 'Buy and Sell Bitcoin in person',
	whatsNew: 'New Features',
	justShipped: 'Just shipped v1.0.0',
	createAnAnonymousPostAt:
		'Create an anonymous post at the location you want to meet. Once someone responds to your post, meet up and complete the transaction in person. Free and open source.',
	messagesSentBetween: 'Messages sent between users are encrypted using PGP',
	loginWithLightning: 'Login With Lightning',
	learnMore: 'Learn More',
	createAPost: 'Create a post',
	toCreateANewPostToBuy:
		'To create a new post to buy or sell Bitcoin, just click on the map where you would like to meet.',
	respondToAPost: 'Respond to a post',
	toSeeOtherPeoplesPosts:
		'To see other peoples posts and respond to them, click on the icons on the map.',
	receiveMessages: 'Receive Messages',
	whenOthersRespond:
		'When others respond to your post, you will receive a message. You can also optionally choose to receive an email.',
	beSafe: 'Be safe',
	makeSureToMeetInACrowded:
		'Make sure to meet in a crowded public place. Do not give out your personal information.',
	thisIsNew: 'This is new!',
	thereAreNotManyPosts:
		'There are not many posts yet because this site is brand new, it was just shipped February 2023. Please, create a post and help us grow! Be patient.'
}

// capitalize the values of the first word
const spanish = {
	home: 'Inicio',
	about: 'Sobre nosotros',
	profile: 'Perfil',
	welcome: 'Bienvenido',
	amount: 'Cantidad',
	type: 'Tipo',
	new: 'Nuevo',
	yourMessages: 'Tus mensajes',
	pgpPassphrase: 'Frase de contraseña PGP',
	postedAt: 'Publicado en',
	yourPgpPassphrase: 'Tu frase de contraseña PGP...',
	youHaveActivePosts: 'Tienes anuncios activos',
	yourPostIsActive: 'Tu anuncio esta activo',
	youHaveANewMessage: 'Tienes un nuevo mensaje',
	signIntoYourAccount: 'Inicia sesion en tu cuenta',
	showOnlyYourPosts: 'Mostrar solo tus anuncios',
	generateNewPgp: 'Generar nuevo par de claves PGP',
	feelFreeTomakeAPr:
		'Siéntete libre de hacer una solicitud de extracción (PR) o abrir un problema (issue). Si tienes alguna pregunta, puedes escribirme a mi correo electrónico: jared.dahlke@protonmail.com.',
	generateANewKeyPair:
		'2. Genera un nuevo par de claves, podrás leer todos los mensajes futuros, pero esto impedirá que puedas descifrar los mensajes antiguos.',
	getYourPassphraseFromTheFirstDevice:
		'1. (Recomendado) Obtén tu frase de contraseña del primer dispositivo en el que iniciaste sesión con esta cuenta y guárdala en el campo de entrada a continuación. Esto te permitirá descifrar mensajes antiguos y futuros.',
	attentionNeededInOrderToDecrypt:
		'Atención necesaria para poder descifrar mensajes',
	weHaveARecordOfYourPgp:
		'Tenemos un registro de tus claves pública y privada PGP, pero no encontramos tu frase de contraseña autogenerada en tus cookies. Tienes 2 opciones:',
	emailUpdated: 'Email actualizado',
	paymentSuccess: 'Pago exitoso!',
	yourPosts: 'Tus anuncios',
	noWalletTry: 'No tienes una billetera? prueba',
	learnMoreAboutLightningLogin: 'Aprende mas sobre Lightning Login',
	toCreateANewPostToBuyOrSell:
		'Para crear un nuevo anuncio para comprar o vender bitcoin solo haz click en cualquier parte del mapa, para ver los anuncios de otras personas haz click en los iconos en el mapa',
	emailSettings: 'Configuracion de Email',
	ifYoudLikeToReceiveAnEmailWhenSomeone:
		'Si deseas recibir un correo electronico cuando alguien te escriba escribe tu correo aqui, sino puedes regresar aqui luego para ver si tienes algun mensaje. no compartiremos tu correo electronico con nadie',
	optional: 'Opcional',
	save: 'Guardar',
	yourMessagesAre:
		'Tus mensajes son encriptados de extremo a extremo utilizando PGP',
	belowIsThePassphrase:
		'Debaje esta tu frase para tus llaves PGP que encriptan tus mensajes. esto esta almacenado en las cookies de tu ordenador. guardala en un lugar seguro en caso de que limpies as cookies de tu ordenador o si deseas acceder a tus mensajes desde otro ordenador ',
	yourMessage: 'Tus Mensajes',
	postId: 'ID De Anuncio',
	otherParty: 'Contraparte',
	latestMessage: 'Ultimo mensaje',
	open: 'Abrir',
	dumpAllOfTheSite:
		'Crear un archivo JSON con todos los datos del sitio web (excepto los correos electrónicos y mensajes).',
	createANewPost: 'Crear un nuevo anuncio',
	buy: 'Comprar',
	sell: 'Vender',
	meetAt: 'Encontrar en',
	latitude: 'Latitud',
	longitude: 'Longitud',
	create: 'Crear',
	user: 'Usuario',
	wantsToBuy: 'Desea comprar',
	wantsToSell: 'Desea vender',
	posted: 'Anunciado',
	chatWithThisUser: 'Chatea con este usuario',
	youAlreadyHaveAnOpenChat: 'Ya tienes abierto un chat para este anuncio',
	openChatWithUser: 'Abrir el chat con el usuario',
	thisIsYourPost: 'Este es tu anuncio',
	delete: 'Borrar',
	daysLive: 'Dias que localsats.org esta activo',
	totalPosts: 'Anuncios totales',
	totalUsers: 'Usuarios totales',
	totalMessages: 'Mensajes totales (encriptados)',
	frequentlyAskedQ: 'Preguntas comunes',
	cantFindTheAnswer:
		'No encuentras la respuesta que estabas buscando? comunicate a',
	whatIsThis: 'Que es esto?',
	itIsAnEasyWayToBuy:
		'Es una manera facil de comprar y vender bitcoin localmente. solo crea un anuncio para comprar o vender bitcoin y espera a que alguien responda. cuando alguien responda, veras los menssajes en tu pagina principal',
	whatDataDoYouStore: 'Que datos conservan?',
	weStoreTheEncrypted:
		'Almacenamos los mensajes y publicaciones encriptados asociados a tu dirección de LNURL-Auth. Si eliges agregar una dirección de correo electrónico para recibir notificaciones, también la almacenaremos. Cuando borras una publicación, tanto la publicación como todos los mensajes asociados se eliminan permanentemente. Si decides eliminar tu dirección de correo electrónico, también se elimina de manera permanente.',
	download: 'Descarga',
	whatIsTheTechStack: '¿Cuál es la pila tecnológica de este sitio web?',
	loginUsesLnurlAuth:
		'El inicio de sesión utiliza LNURL-auth. El frontend está construido con Next.js y Tailwind CSS. La base de datos es MongoDB. El servicio de correo electrónico está alojado en AWS. El sitio está alojado en Vercel.',
	howDoIContribute: 'Como puedo contribuir?',
	IdeasContributorsAreWelcome:
		'¡Se aceptan ideas y contribuciones! Aquí está el enlace al repositorio de GitHub:',
	signOut: 'Desconectar',
	yourUserIdFromLnurl: 'Tu id de usuario y autorizacion lnurl',
	buyAndSellBitcoinInPerson: 'Compra y Bende Bitcoin en persona',
	whatsNew: 'Novedades',
	justShipped: 'Acaba de arribar v1.0.0',
	createAnAnonymousPostAt:
		'Crea un anuncio anónimo en la ubicación donde quieras reunirte. Una vez que alguien responda a tu anuncio, reúnanse y completen la transacción en persona. Gratis y de código abierto.',
	messagesSentBetween:
		'Los mensajes enviados entre usuarios son encriptados usando PGP',
	loginWithLightning: 'Conectar con lightning',
	learnMore: 'Aprender mas',
	createAPost: 'Crear un anuncio',
	toCreateANewPostToBuy:
		'Para crear un nuevo anuncio para comprar o vender bitcoin haz click en el mapa en el lugar donde deseas encontrarte',
	respondToAPost: 'Responder a un anuncio',
	toSeeOtherPeoplesPosts:
		'Para ver los anuncios de otras personas y responderlos, haz click en los inconos del mapa',
	receiveMessages: 'Recibe mensaje',
	whenOthersRespond:
		'Cuando alguien responde a tu anuncio tu recibiras un mensaje. tambien puedes recibir un correo electronico opcional.',
	beSafe: 'Mantente seguro',
	makeSureToMeetInACrowded:
		'Asegurate de reunirte en unlugar publico. no des tu informacion personal',
	thisIsNew: 'Esto es nuevo!',
	thereAreNotManyPosts:
		'No hay muchos anuncios nuevos todavia por que este es un sitio nuevo, esta solamente desde febrero 2023, por favor crea un anuncio y ayudanos a crecer! se paciente.'
}
