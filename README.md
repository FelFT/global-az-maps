# global-az-maps
Este repositorio contiene una página web lista para poderse enlazar a una instancia de Azure Maps y poderse desplegar en Azure Static Web Apps

# Procedimiento
## Requerimientos 
- Una suscripción de [Azure](https://azure.microsoft.com/es-es/?wt.mc_id=studentamb_159817)
  - [Azure for Students](https://azure.microsoft.com/es-es/free/students/?wt.mc_id=studentamb_159817)
  - [Cuenta gratuita de Azure](https://azure.microsoft.com/es-es/free/?wt.mc_id=studentamb_159817) 
- Visual Studio Code
- Git 
- GitHub Desktop _(opcional)_

## Servicio de Azure Maps
1. Accede al [portal de Azure](https://portal.azure.com/?wt.mc_id=studentamb_159817).

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/4cf259e0-875b-4783-a313-47cc0c3e261e)

2. En el buscador, escribe _Cuentas de Azure Maps_ y selecciona el primer resultado.

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/f4df1124-0de4-41c8-bf78-b71b46376291)


3. Haz clic en el botón de crear. Se mostrará la siguiente pantalla.

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/4740d0dc-f548-4270-8d58-de43179eab3d)

4. Selecciona una suscripción válida. Crea un nuevo grupo de recursos con el nombre que prefieras.

5. Asigna un nombre al recurso, selecciona una región y un plan de tarifa.

6. Acepta los términos y condiciones del servicio.

7. Haz clic en **Revisar y crear**. Espera que se aprovisione el recurso.

8. Dirígete al recurso que acabas de crear. Verás una pantalla como la siguiente.

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/816f1d4c-0a11-4a8a-a83a-4cecae9cdda2)

9. Selecciona el botón **Ver autenticación**

10. Almacena la clave principal, es la que utilizaremos para desplegar el recurso.

## Crea una copia del repositorio
1. En este reposirtorio, haz clic en el botón **Fork**, para crea una copia en tu repositorio
![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/3a3359e1-6986-4fd2-9292-a42d7dfac1f7)

2. Selecciona tu cuenta de GitHub, deja el nombre que trae por defecto y haz clic en el botón **Create a fork**

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/a8d7c0a9-04ca-48b3-912c-8d48fa2fbd6c)


## Clonar el proyecto
1. Crea un directorio donde almacenarás el proyecto.

2. Abre la terminal en la ubicación del directorio que acabas de crear.

3. Ejecuta el siguiente comando en la terminal (recuerda reemplazar `{YOUR_USER}` por tu usuario de GitHub):

```
git clone https://github.com/{YOUR_USER}/global-az-maps
```

## Editar el proyecto
1. Ejecuta Visual Studio Code y abre el directorio donde se encuentra el proyecto
![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/f4c23f9f-13cc-456c-94f0-1f6d7cfb609b)

2. En el directorio de la izquierda, abre el archivo `/src/js/main.js`.
![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/33654a50-6fbf-4019-b182-a9e9ab49e739)

3. En la línea 22, reemplaza `[YOUR_AZURE_MAPS_KEY]` por la clave principal que almacenaste previamente en la creación del recurso Azure Maps.

4. Guarda todos los cambios.

5. En el menú de la izquierda, selecciona **Control de código fuente**. Escribe un mensaje y selcciona **Confirmación**. 

## Desplegar el proyecto en Azure
1. Accede nuevamente al [portal de Azure](https://portal.azure.com/?wt.mc_id=studentamb_159817).

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/4cf259e0-875b-4783-a313-47cc0c3e261e)

2. En el buscador, escribe _Aplicaciones Web Estáticas_ y selecciona la primera opción

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/30dfe834-3b9b-4db3-87ef-b0cb964a1100)

3. Haz clic en el botón de crear. Se mostrará la siguiente pantalla.

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/a2cbd82f-a97b-450c-849a-74699bad4f15)

4. Selecciona una suscripción válida. Selecciona el grupo de recursos que creaste.

5. Asigna un nombre al recurso, selecciona un plan de hospedaje y una región.

6. En **Detalles de la implementación**, selecciona **GitHub**, e inicia sesión con tu cuenta. Selecciona tu organización, el repositorio _global-az-maps_, y la rama **main**. Se desplegará un nuevo menú.

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/32fa6a6a-c1b0-4335-967f-46319d0c1be7)

7. En **Detalles de la compilación**, selecciona _HTML_ para el primer campo. En la **Ubicación de la aplicación**, escribe _/src_.

![image](https://github.com/tohtechcommunity/global-az-maps/assets/50784966/24d24476-9666-488f-9952-ec008c379183)

8. Haz clic en **Revisar y crear**

9. Dirígete al recurso que acabas de crear. Haz clic en el URL público para visualizar tu página web.

# Recursos

- [Publicación de una aplicación de JavaScript de Angular, React, Svelte o Vue con Azure Static Web Apps](https://learn.microsoft.com/es-es/training/modules/publish-app-service-static-web-app-api/?wt.mc_id=studentamb_159817)
- [Creación de la primera aplicación de búsqueda de rutas con Azure Maps](https://learn.microsoft.com/es-es/training/modules/create-your-first-app-with-azure-maps/?wt.mc_id=studentamb_159817)
- [Azure Maps Samples](https://samples.azuremaps.com/)
- 
