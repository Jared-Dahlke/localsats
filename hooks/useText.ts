import { useRouter } from 'next/router'

export const useText = () => {
	const { locale } = useRouter()
	let lang
	switch (locale) {
		case 'en':
			lang = english
			break
		case 'es':
			lang = spanish
			break
		case 'de':
			lang = german
			break
		default:
			lang = english
			break
	}
	return lang
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
	//
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
	//
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

const german = {
	home: 'Startseite',
	about: 'Über uns',
	profile: 'Profil',
	welcome: 'Willkommen',
	amount: 'Betrag',
	postedAt: 'Veröffentlicht am',
	type: 'Art',
	pgpPassphrase: 'PGP-Passwort',
	yourMessages: 'Deine Nachrichten',
	yourPgpPassphrase: 'Dein PGP-Passwort...',
	new: 'Neu',
	youHaveANewMessage: 'Du hast eine neue Nachricht',
	signIntoYourAccount: 'Melde dich in deinem Konto an',
	noWalletTry: 'Keine Brieftasche? Probieren Sie eine dieser',
	youHaveActivePosts: 'Du hast aktive Beiträge',
	generateNewPgp: 'Neues PGP-Schlüsselpaar generieren',
	generateANewKeyPair:
		'2. Generieren Sie ein neues Schlüsselpaar. Sie können alle zukünftigen Nachrichten lesen, können jedoch alte Nachrichten nicht mehr entschlüsseln',
	getYourPassphraseFromTheFirstDevice:
		'1. (Empfohlen) Holen Sie sich Ihr Passwort vom ersten Gerät, mit dem Sie sich mit diesem Konto angemeldet haben, und speichern Sie es im folgenden Eingabefeld. Dadurch können Sie alte und zukünftige Nachrichten entschlüsseln.',
	weHaveARecordOfYourPgp:
		'Wir haben einen Datensatz Ihrer PGP-Public- und Private-Keys, aber Ihr automatisch generiertes Passwort wurde nicht in Ihren Cookies gefunden. Sie haben 2 Optionen:',
	emailUpdated: 'E-Mail aktualisiert',
	attentionNeededInOrderToDecrypt:
		'Zur Entschlüsselung zukünftiger Nachrichten ist besondere Aufmerksamkeit erforderlich',
	yourPosts: 'Deine Beiträge',
	paymentSuccess: 'Zahlung erfolgreich!',
	yourPostIsActive: 'Dein Beitrag ist aktiv',
	showOnlyYourPosts: 'Nur deine Beiträge anzeigen',
	learnMoreAboutLightningLogin: 'Erfahren Sie mehr über Lightning-Login',
	toCreateANewPostToBuyOrSell:
		'Um einen neuen Beitrag zum Kauf oder Verkauf von Bitcoin zu erstellen, klicken Sie einfach irgendwo auf der Karte. Um die Beiträge anderer Personen zu sehen, klicken Sie auf die Symbole auf der Karte.',
	emailSettings: 'E-Mail-Einstellungen',
	ifYoudLikeToReceiveAnEmailWhenSomeone:
		'Wenn Sie eine E-Mail erhalten möchten, wenn jemand Ihnen eine Nachricht sendet, fügen Sie hier eine E-Mail hinzu. Andernfalls können Sie später überprüfen, ob Sie Nachrichten haben. Wir werden Ihre E-Mail-Adresse nicht an Dritte weitergeben.',
	optional: 'Optional',
	save: 'speichern',
	yourMessagesAre: 'Ihre Nachrichten sind Ende-zu-Ende verschlüsselt mit PGP',
	belowIsThePassphrase:
		'Nachfolgend finden Sie das Passwort zu Ihren PGP-Schlüsseln, mit dem Ihre Nachrichten verschlüsselt sind. Dies wird als Cookie in Ihrem Browser gespeichert. Speichern Sie es an einem sicheren Ort, falls Sie Ihre Cookies löschen oder von einem anderen Gerät aus auf Ihre Nachrichten zugreifen möchten.',
	yourMessage: 'Ihre Nachrichten',
	postId: 'POST-ID',
	otherParty: 'Andere Partei',
	latestMessage: 'Letzte Nachricht',
	open: 'Öffnen',
	createANewPost: 'Neuen Post erstellen',
	buy: 'Kaufen',
	sell: 'Verkaufen',
	meetAt: 'Treffen bei',
	latitude: 'Breitengrad',
	longitude: 'Längengrad',
	create: 'Erstellen',
	user: 'Benutzer',
	wantsToBuy: 'möchte kaufen',
	wantsToSell: 'möchte verkaufen',
	posted: 'Veröffentlicht',
	chatWithThisUser: 'Mit diesem Benutzer chatten',
	youAlreadyHaveAnOpenChat:
		'Sie haben bereits einen offenen Chat für diesen Post',
	openChatWithUser: 'Chat mit Benutzer öffnen',
	thisIsYourPost: 'Dies ist Ihr Post',
	delete: 'Löschen',
	daysLive: 'Tage seit LocalSats.org Live ist',
	totalPosts: 'Gesamte Posts',
	totalUsers: 'Gesamte Benutzer',
	totalMessages: 'Gesamte Nachrichten (verschlüsselt)',
	frequentlyAskedQ: 'Häufig gestellte Fragen',
	cantFindTheAnswer: 'Sie finden die Antwort nicht? Schreiben Sie an',
	whatIsThis: 'Was ist das?',
	itIsAnEasyWayToBuy:
		'Es ist eine einfache Möglichkeit, Bitcoin lokal zu kaufen und zu verkaufen. Erstellen Sie einfach einen Post zum Kaufen oder Verkaufen von Bitcoin und warten Sie auf eine Antwort. Sobald jemand antwortet, sehen Sie deren Nachricht auf der Startseite. Außerdem können Sie eine E-Mail-Adresse hinzufügen, um eine Benachrichtigung zu erhalten, wenn jemand auf Ihren Post antwortet. Wir werden Ihre E-Mail-Adresse niemals an Dritte weitergeben. Von dort aus können Sie den Chat verwenden, um eine Zeit zum Treffen und Kauf/Verkauf Ihres Bitcoin zu vereinbaren.',
	whatDataDoYouStore: 'Welche Daten speichern Sie?',
	weStoreTheEncrypted:
		'Wir speichern die verschlüsselten Nachrichten und Posts, die mit Ihrer LNURL-Auth-Adresse verbunden sind. Wenn Sie eine E-Mail-Adresse für Benachrichtigungen hinzufügen, speichern wir diese ebenfalls. Wenn Sie einen Post löschen, wird dieser Post und alle damit verbundenen Nachrichten dauerhaft gelöscht. Wenn Sie Ihre E-Mail-Adresse entfernen möchten, wird diese ebenfalls dauerhaft gelöscht.',
	dumpAllOfTheSite:
		'Exportieren Sie alle Website-Daten (außer E-Mails und Nachrichten) in eine JSON-Datei:',
	download: 'Herunterladen',
	whatIsTheTechStack: 'Was ist der Tech-Stack für diese Seite?',
	loginUsesLnurlAuth:
		'Die Anmeldung verwendet LNURL-auth. Das Frontend ist mit Next.js und Tailwind CSS erstellt. Die Datenbank ist MongoDB. Der E-Mail-Dienst wird auf AWS gehostet. Die Website wird auf Vercel gehostet.',
	howDoIContribute: 'Wie kann ich beitragen?',
	IdeasContributorsAreWelcome:
		'Ideen und Beiträge sind willkommen! Hier ist das Github:',
	feelFreeTomakeAPr:
		'Fühlen Sie sich frei, eine PR zu erstellen oder ein Problem zu öffnen. Meine E-Mail ist jared.dahlke@protonmail.com, wenn Sie Fragen haben.',
	signOut: 'Ausloggen',
	yourUserIdFromLnurl: 'Ihre Benutzer-ID von LNURL-auth:',
	buyAndSellBitcoinInPerson: 'Bitcoin persönlich kaufen und verkaufen',
	whatsNew: 'Neue Funktionen',
	justShipped: 'Gerade v1.0.0 verschifft',
	createAnAnonymousPostAt:
		'Erstellen Sie einen anonymen Beitrag an dem Ort, an dem Sie sich treffen möchten. Sobald jemand auf Ihren Beitrag antwortet, treffen Sie sich und führen Sie die Transaktion persönlich durch. Kostenlos und Open Source.',
	messagesSentBetween:
		'Zwischen Benutzern gesendete Nachrichten werden mit PGP verschlüsselt',
	loginWithLightning: 'Anmeldung mit Lightning',
	learnMore: 'Erfahren Sie mehr',
	createAPost: 'Einen Beitrag erstellen',
	toCreateANewPostToBuy:
		'Um einen neuen Beitrag zum Kauf oder Verkauf von Bitcoin zu erstellen, klicken Sie einfach auf der Karte, wo Sie sich treffen möchten.',
	respondToAPost: 'Auf einen Beitrag antworten',
	toSeeOtherPeoplesPosts:
		'Um die Beiträge anderer Personen zu sehen und darauf zu antworten, klicken Sie auf die Symbole auf der Karte.',
	receiveMessages: 'Nachrichten empfangen',
	whenOthersRespond:
		'Wenn andere auf Ihren Beitrag antworten, erhalten Sie eine Nachricht. Sie können auch optional wählen, eine E-Mail zu erhalten.',
	beSafe: 'Seien Sie sicher',
	makeSureToMeetInACrowded:
		'Stellen Sie sicher, dass Sie sich an einem belebten öffentlichen Ort treffen. Geben Sie keine persönlichen Informationen preis.',
	thisIsNew: 'Das ist neu!',
	thereAreNotManyPosts:
		'Es gibt noch nicht viele Beiträge, da diese Website brandneu ist und erst im Februar 2023 verschifft wurde. Bitte erstellen Sie einen Beitrag und helfen Sie uns zu wachsen! Seien Sie geduldig.'
}
