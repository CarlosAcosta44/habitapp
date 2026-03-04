# habitapp


<!-- 
COMO INICIAR PROYECTO

Paso 1: Actualizar credenciales de AWS en GitHub

En AWS Academy → click en AWS Details → Show
Copia los 3 valores:

aws_access_key_id
aws_secret_access_key
aws_session_token


Ve a tu repo GitHub → Settings → Secrets and variables → Actions
Actualiza los 3 secrets:

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN




Paso 2: Verificar recursos en AWS
S3 - Frontend

Busca S3 en la consola AWS
Verifica que existe habitapp-frontend-carlos
Si no existe, créalo:

Desactiva Block public access
Habilita Static website hosting con index.html
Agrega esta Bucket policy:



json{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::habitapp-frontend-carlos/*"
  }]
}
S3 - Media Storage

Verifica que existe habitapp-media-store
Si no existe, créalo:

Desactiva Block public access
Agrega Bucket policy:



json{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::habitapp-media-store/*"
  }]
}

Agrega CORS:

json[{
  "AllowedHeaders": ["*"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedOrigins": ["*"],
  "ExposeHeaders": []
}]
Elastic Beanstalk - Backend

Busca Elastic Beanstalk en la consola
Verifica que existe habitapp-backend-env
Si no existe, créalo:

Application name: habitapp-backend
Environment name: habitapp-backend-env
Platform: Node.js 18 en Amazon Linux 2023




Paso 3: Redesployar
bashgit commit --allow-empty -m "redeploy"
git push origin main
Ve a GitHub → Actions y verifica que quede en ✅ verde.

Paso 4: Verificar URLs
ServicioURLFrontendhttp://habitapp-frontend-carlos.s3-website-us-east-1.amazonaws.comBackendURL de Elastic Beanstalk en la consolaMediahttps://habitapp-media-store.s3.amazonaws.com/ -->
