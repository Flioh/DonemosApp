# Donemos App Móvil

[Donemos](https://www.donemos.com.ar/) es una plataforma **sin fines de lucro** que ayuda a conectar a quienes necesitan donantes y quienes puedan colaborar (sin ser necesariamente familiares o amigos).

## Nosotros
Somos un pequeño estudio de diseño de la ciudad de Santa Fe especializado en la creación de productos digitales.

## La idea
Desde lo profesional, siempre nos proponemos aprender nuevas tecnologías buscando aquellas que puedan tener un fuerte impacto en la sociedad. Desde lo personal, y especialmente como estudiantes de una universidad pública, **sentimos la necesidad de contribuir con la sociedad desde el lugar que nos toca ocupar**. Donemos es la unión de ambos objetivos.

Las personas utilizan las redes sociales y aplicaciones tales como whatsapp o el correo electrónico para solicitar donantes, lo que hace muy difícil volver a encontrar la información al cabo de unos días. Es por esto que decidimos generar una plataforma que ayude a conectar a quienes necesitan donantes y quienes puedan colaborar (sin ser necesariamente familiares o amigos).

Luego de hablar con especialistas tomamos conciencia de lo sencillo, seguro y práctico que resulta donar sangre, y del gran impacto que tiene, porque lamentablemente siempre hace falta. Es por esto que nuestro objetivo se vuelve más ambicioso: **generar conciencia para lograr que cada vez haya mayor cantidad de donantes voluntarios (y no sólo de reposición cuando un amigo o familiar lo necesita) para que nuestro país tenga un stock recurrente de sangre segura**.

Ojalá algún día las donaciones no estén vinculadas a situaciones de emergencia, sino más bien a algo cotidiano y habitual en nuestras vidas; ojalá algún día esta aplicación ya no sea necesaria.

## Implementación

Donemos fue implementada utilizando [Ionic2](http://ionicframework.com/), el cual es un framework de código abierto, basado en Angular 2, que permite crear aplicaciones móviles nativas utilizando los mismos conocimientos que se utilizan para crear sitios web.

Otras librerías utilizadas:
* [Auth0](https://auth0.com/)
* [Google Places API](https://developers.google.com/places/)

## Cómo usar

1. Instalá [Ionic2](http://ionicframework.com/docs/v2/setup/installation/)
2. Descargá la [API REST de Donemos](https://github.com/Flioh/DonemosApi) y revisá los requisitos para ejecutarla
3. Creá una cuenta en [Auth0](https://auth0.com/) y setea las tus datos en el [archivo de configuración](https://github.com/Flioh/DonemosApp/blob/master/app/shared/app-config.ts)
4. Ejecutá `npm install`
5. Ejecuta la app móvil con `ionic serve -t android`

## Contribuí

Si ves que hay algún dato erróneo, o cualquier cosa que se pueda mejorar, avisanos a donemos@flioh.com
