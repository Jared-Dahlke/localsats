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
	howLongDoYouKeepOrders: 'How long do you keep orders?',
	weKeepOrders:
		'The app keeps orders on the map permanently, but if a user does not respond to messages regarding their order within 14 days, the order and related messages are deleted.',
	searchForACityOrAddress: 'Search for a city or address...',
	youCanOnlyHaveOnePost:
		'You can only have two orders. Delete one to make room for a new one.',
	maximumPostsReached: 'Maximum Posts Reached',
	clickOrScan: 'Click or scan:',
	deletePost: 'Delete Post',
	areYouSureYouWantToDelete: 'Are you sure you want to delete this order?',
	hereAreSomeQuickTips: 'Here are some quick tips to get you started:',
	youWillBeRedirected: 'You will be redirected to the home page',
	acceptTheLogin: 'accept the Login in',
	step3Scan: 'Step 3: Scan the below QR Code with your phone, open in',
	step4:
		'Step 4: Come back to the site and you will be redirected to the home page',
	step3:
		'Step 3: Tap this login button, follow the prompt and you will be logged in',
	thenComeBack: 'Then come back to this page',
	onYourPhoneAndClick: 'on your phone and click',
	step2Open: 'Step 2: Open',
	onYourPhone: 'on your phone',
	step1Install: 'Step 1: Install',
	showMeHow: 'Login tutorial',
	yours: 'Yours',
	home: 'Home',
	about: 'About',
	profile: 'Profile',
	welcome: 'Welcome',
	amount: 'Amount',
	postedAt: 'Posted At',
	type: 'Type',
	pgpPassphrase: 'PGP Passphrase',
	yourChats: 'Your Chats',
	yourPgpPassphrase: 'Your PGP Passphrase...',
	new: 'New',
	youHaveANewMessage: 'You have a new message',
	signIntoYourAccount: 'Sign into your account',
	youHaveActivePosts: 'You have active orders',
	generateNewPgp: 'Generate new PGP key pair',

	emailUpdated: 'Email updated',

	yourOrders: 'Your Orders',
	paymentSuccess: 'Payment Success!',
	showOnlyYourPosts: 'Show only your orders',
	learnMoreAboutLightningLogin: 'learn more about Lightning login',
	toCreateANewPostToBuyOrSell:
		'To create a new order to buy or sell bitcoin, just click anywhere on the map. To see other peoples orders, click on the icons on the map.',
	emailSettings: 'Email Settings',
	ifYoudLikeToReceiveAnEmailWhenSomeone:
		"If you'd like to receive an email when someone messages you, add an email here. Otherwise you can just check back later to see if you have any messages. We will not share your email with anyone.",
	optional: 'optional',
	//
	save: 'save',
	yourMessagesAre: 'Your Messages are end-to-end encrypted using PGP',
	belowIsThePassphrase:
		'Below is the passphrase to your PGP keys that encrypt your messages. This is stored in your browser in local storage. Save it somewhere safe in case you clear your local storage or you want to access your messages from another device.',
	yourMessage: 'Your Messages',
	orderId: 'Order ID',
	otherParty: 'Other Party',
	latestMessage: 'Latest Message',
	open: 'Open',
	createANewPost: 'Create a new order',
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
	youAlreadyHaveAnOpenChat: 'You already have an open chat for this order',
	openChatWithUser: 'Open Chat With User',
	thisIsYourPost: 'This is your order',
	delete: 'Delete',
	daysLive: 'Days LocalSats.org has been Live',
	totalPosts: 'Total Orders',
	totalUsers: 'Total Users',
	totalMessages: 'Total Messages',
	frequentlyAskedQ: 'Frequently Asked Questions',
	cantFindTheAnswer: 'Can’t find the answer you’re looking for? Reach out to',
	whatIsThis: 'What is this?',
	itIsAnEasyWayToBuy:
		'It is an easy way to buy and sell bitcoin locally. Just create a order to either buy or sell bitcoin, then wait for someone to respond. Once someone responds, you will see their message on the home page. Additionally, you can add an email address to receive an email when someone responds to your order. We will never share your email with anyone. From there, you can use the chat to arrange a time to meet and buy/sell your bitcoin.',
	whatDataDoYouStore: 'What data do you store?',
	weStoreTheEncrypted:
		'We store the encrypted messages and orders associated with your LNURL-Auth address. If you choose to add an email address for notifications, we will store that as well. If you choose to remove your email, that is permanently deleted as well.',
	dumpAllOfTheSite:
		'Dump all of the site data (except emails and messages) into a JSON file:',
	download: 'Download',
	//
	whatIsTheTechStack: 'What is the tech stack for this site?',
	loginUsesLnurlAuth:
		'Login uses LNURL-auth. The frontend is built with Next.js and Tailwind CSS. The database is Cockroach DB. The email service is hosted on AWS. The site is hosted on Vercel.',
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
		'Create an anonymous order at the location you want to meet. Once someone responds to your order, meet up and complete the transaction in person. Free and open source.',
	messagesSentBetween: 'Messages sent between users are encrypted using PGP',
	loginWithLightning: 'Login With Lightning',
	learnMore: 'Learn More',
	createAPost: 'Create a order',
	toCreateANewPostToBuy:
		'To create a new order to buy or sell Bitcoin, just click on the map where you would like to meet.',
	respondToAPost: 'Respond to a order',
	toSeeOtherPeoplesPosts:
		'To see other peoples` orders and respond to them, click on the icons on the map.',
	receiveMessages: 'Receive Messages',
	whenOthersRespond:
		'When others respond to your order, you will receive a message. You can also optionally choose to receive an email.',
	beSafe: 'Be safe',
	makeSureToMeetInACrowded:
		'Make sure to meet in a crowded public place. Do not give out your personal information.',
	thisIsNew: 'This is new!',
	thereAreNotManyPosts:
		'There are not many orders yet because this site is brand new, it was just shipped February 2023. Please, create a order and help us grow! Be patient.'
}

const spanish = {
	howLongDoYouKeepOrders: '¿Cuánto tiempo mantienes las ordens?',
	weKeepOrders:
		'La aplicación mantiene las ordens en el mapa permanentemente, pero si un usuario no responde a los mensajes relacionados con su orden dentro de los 14 días, la orden y los mensajes relacionados se eliminan.',

	searchForACityOrAddress: 'Buscar una ciudad o dirección...',
	orderId: 'ID de orden',
	youCanOnlyHaveOnePost:
		'Sólo puedes tener dos pedidos. Elimina uno para hacer espacio para uno nuevo.',
	maximumPostsReached: 'Has alcanzado el máximo de ordenes',
	clickOrScan: 'Haz clic o escanea:',
	deletePost: 'Eliminar post',
	areYouSureYouWantToDelete: '¿Estás seguro de que quieres eliminar este post?',
	hereAreSomeQuickTips: 'Aquí hay algunos consejos rápidos',
	youWillBeRedirected: 'Serás redirigido/a a la página de inicio.',
	acceptTheLogin: 'acepta el inicio de sesión',
	step3Scan: 'Paso 3: Escanea el código QR de abajo con tu teléfono, ábrelo en',
	step4: 'Paso 4: Vuelve al sitio y serás redirigido a la página de inicio.',
	step3:
		'Paso 3: Pulsa este botón de inicio de sesión, sigue las indicaciones y estarás conectado.',
	thenComeBack: 'Luego regresa a esta página',
	onYourPhoneAndClick: 'en tu teléfono y haz clic en',
	step2Open: 'Paso 2: Abrir',
	onYourPhone: 'en tu teléfono',
	step1Install: 'Paso 1: Instalar',
	showMeHow: 'Tutorial de inicio de sesión',
	yours: 'Tus',
	home: 'Inicio',
	about: 'Sobre nosotros',
	profile: 'Perfil',
	welcome: 'Bienvenido',
	amount: 'Cantidad',
	type: 'Tipo',
	new: 'Nuevo',
	yourChats: 'Tus chats',
	pgpPassphrase: 'Frase de contraseña PGP',
	postedAt: 'Publicado en',
	yourPgpPassphrase: 'Tu frase de contraseña PGP...',
	youHaveActivePosts: 'Tienes ordenes activas',
	youHaveANewMessage: 'Tienes un nuevo mensaje',
	signIntoYourAccount: 'Inicia sesión en tu cuenta',
	showOnlyYourPosts: 'Mostrar solo tus ordenes',
	generateNewPgp: 'Generar nuevo par de claves PGP',
	feelFreeTomakeAPr:
		'Siéntete libre de hacer una solicitud de extracción (PR) o abrir un problema (issue). Si tienes alguna pregunta, puedes escribirme a mi correo electrónico: jared.dahlke@protonmail.com.',

	emailUpdated: 'Email actualizado',
	paymentSuccess: '¡Pago exitoso!',
	yourOrders: 'Tus pedidos',

	learnMoreAboutLightningLogin: 'Aprende más sobre Lightning Login',
	toCreateANewPostToBuyOrSell:
		'Para crear una nueva orden para comprar o vender bitcoin solo haz click en cualquier parte del mapa, para ver las ordenes de otras personas haz click en los íconos en el mapa',
	emailSettings: 'Configuración de Email',
	ifYoudLikeToReceiveAnEmailWhenSomeone:
		'Si deseas recibir un correo electronico cuando alguien te escriba escribe tu correo aqui, sino puedes regresar aquí luego para ver si tienes algún mensaje. No compartiremos tu correo electrónico con nadie',
	optional: 'Opcional',
	save: 'Guardar',
	yourMessagesAre:
		'Tus mensajes son encriptados de extremo a extremo utilizando PGP',
	belowIsThePassphrase:
		'Debajo está tu frase para tus llaves PGP que encriptan tus mensajes. Esto está almacenado en las cookies de tu ordenador. Guardala en un lugar seguro en caso de que limpies las cookies de tu ordenador o si deseas acceder a tus mensajes desde otro ordenador ',
	yourMessage: 'Tus Mensajes',
	postId: 'ID De Orden',
	otherParty: 'Contraparte',
	latestMessage: 'Último mensaje',
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
	posted: 'Publicado',
	chatWithThisUser: 'Chatea con este usuario',
	youAlreadyHaveAnOpenChat: 'Ya tienes abierto un chat para este anuncio',
	openChatWithUser: 'Abrir el chat con el usuario',
	thisIsYourPost: 'Este es tu anuncio',
	delete: 'Borrar',
	daysLive: 'Días que localsats.org está activo',
	totalPosts: 'Ordenes totales',
	totalUsers: 'Usuarios totales',
	totalMessages: 'Mensajes totales',
	frequentlyAskedQ: 'Preguntas comunes',
	cantFindTheAnswer:
		'¿No encuentras la respuesta que estabas buscando? Comunicate a',
	whatIsThis: '¿Qué es esto?',
	itIsAnEasyWayToBuy:
		'Es una manera fácil de comprar y vender bitcoin localmente. Solo crea un anuncio para comprar o vender bitcoin y espera a que alguien responda. Cuando alguien responda, veras los mensajes en tu página principal',
	whatDataDoYouStore: '¿Qué datos conservan?',
	weStoreTheEncrypted:
		'Almacenamos los mensajes y publicaciones encriptados asociados a tu dirección de LNURL-Auth. Si eliges agregar una dirección de correo electrónico para recibir notificaciones, también la almacenaremos. Cuando borras una publicación, tanto la publicación como todos los mensajes asociados se eliminan permanentemente. Si decides eliminar tu dirección de correo electrónico, también se elimina de manera permanente.',
	download: 'Descarga',
	whatIsTheTechStack: '¿Cuál es la pila tecnológica de este sitio web?',
	loginUsesLnurlAuth:
		'El inicio de sesión utiliza LNURL-auth. El frontend está construido con Next.js y Tailwind CSS. La base de datos es Cockroach DB. El servicio de correo electrónico está alojado en AWS. El sitio está alojado en Vercel.',
	howDoIContribute: '¿Cómo puedo contribuir?',
	IdeasContributorsAreWelcome:
		'¡Se aceptan ideas y contribuciones! Aquí está el enlace al repositorio de GitHub:',
	signOut: 'Desconectar',
	yourUserIdFromLnurl: 'Tu id de usuario y autorizacion lnurl',
	buyAndSellBitcoinInPerson: 'Compra y Vende Bitcoin en persona',
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
		'Para ver las ordenes de otras personas y responderlos, haz click en los íconos del mapa',
	receiveMessages: 'Recibe mensaje',
	whenOthersRespond:
		'Cuando alguien responde a tu anuncio tú recibirás un mensaje. También puedes recibir un correo electrónico opcional.',
	beSafe: 'Mantente seguro',
	makeSureToMeetInACrowded:
		'Asegurate de reunirte en un lugar público. no des tu información personal',
	thisIsNew: '¡Esto es nuevo!',
	thereAreNotManyPosts:
		'No hay muchas ordenes nuevas todavía por que este es un sitio nuevo, esta solamente desde febrero 2023, por favor crea un anuncio y ayudanos a crecer! Se paciente.'
}

const german = {
	howLongDoYouKeepOrders: 'Wie lange behalten Sie Bestellungen?',
	weKeepOrders:
		'Die App behält Bestellungen auf der Karte dauerhaft, aber wenn ein Benutzer nicht innerhalb von 14 Tagen auf Nachrichten zu seiner Bestellung antwortet, werden die Bestellung und die zugehörigen Nachrichten gelöscht.',
	searchForACityOrAddress: 'Suche nach einer Stadt oder Adresse...',
	orderId: 'Bestellnummer',
	youCanOnlyHaveOnePost:
		'Du kannst nur zwei Bestellungen haben. Lösche eine, um Platz für eine neue zu machen.',
	maximumPostsReached: 'Maximale Anzahl von Anzeigen erreicht',
	clickOrScan: 'Klicken oder scannen:',
	deletePost: 'Anzeige löschen',
	areYouSureYouWantToDelete: 'Bist du sicher, dass du löschen willst?',
	hereAreSomeQuickTips: 'Hier sind ein paar Tipps',
	youWillBeRedirected: 'Sie werden zur Startseite weitergeleitet.',
	acceptTheLogin: 'akzeptieren Sie die Anmeldung',
	step3Scan:
		'Schritt 3: Scannen Sie den QR-Code unten mit Ihrem Telefon und öffnen Sie ihn in',
	step4:
		'Schritt 4: Kommen Sie zurück zur Website und Sie werden zur Startseite weitergeleitet.',
	step3:
		'Schritt 3: Tippen Sie auf diese Anmeldeschaltfläche, folgen Sie der Aufforderung und Sie werden angemeldet.',
	thenComeBack: 'Dann kommen Sie zurück zu dieser Seite',
	onYourPhoneAndClick: 'auf deinem Telefon und klicken',
	step2Open: 'Schritt 2: Öffnen',
	onYourPhone: 'auf deinem Handy',
	step1Install: 'Schritt 1: Installieren',
	showMeHow: 'Anleitung zur Anmeldung',
	yours: 'Deine',
	home: 'Startseite',
	about: 'Über uns',
	profile: 'Profil',
	welcome: 'Willkommen',
	amount: 'Betrag',
	postedAt: 'Veröffentlicht am',
	type: 'Art',
	pgpPassphrase: 'PGP-Passwort',
	yourChats: 'Deine Chats',
	yourPgpPassphrase: 'Dein PGP-Passwort...',
	new: 'Neu',
	youHaveANewMessage: 'Du hast eine neue Nachricht',
	signIntoYourAccount: 'Melde dich in deinem Konto an',
	youHaveActivePosts: 'Du hast aktive Beiträge',
	generateNewPgp: 'Neues PGP-Schlüsselpaar generieren',

	emailUpdated: 'E-Mail aktualisiert',

	yourOrders: 'Deine Bestellungen',
	paymentSuccess: 'Zahlung erfolgreich!',
	showOnlyYourPosts: 'Zeige nur deine Bestellungen',
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
		'Nachfolgend finden Sie das Passwort zu Ihren PGP-Schlüsseln, mit dem Ihre Nachrichten verschlüsselt sind. Dies wird als local storage in Ihrem Browser gespeichert. Speichern Sie es an einem sicheren Ort, falls Sie Ihre Local storage löschen oder von einem anderen Gerät aus auf Ihre Nachrichten zugreifen möchten.',
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
	totalMessages: 'Gesamte Nachrichten',
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
		'Die Anmeldung verwendet LNURL-auth. Das Frontend ist mit Next.js und Tailwind CSS erstellt. Die Datenbank ist Cockroach DB. Der E-Mail-Dienst wird auf AWS gehostet. Die Website wird auf Vercel gehostet.',
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
