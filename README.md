## 1.프로젝트 설치 및 실행 방법

> 1.  Git Clone
> 2.  yarn install
> 3.  write env
> 4.  docker compose build
> 5.  docker compose up

## 2.env

```
DB_TYPE=데이터베이스 Type (mysql 로 고정)
DB_PORT=데이터베이스 Port (docker-compose.yaml에서 mysql exposed port 참조)
DB_HOST=데이터베이스 URI (네임리졸루션 사용)
DB_NAME=데이터베이스 이름
DB_USER=MYSQL 유저 이름
DB_PASS=MYSQL 패스워드

GOOGLE_CLIENT_ID=구글 클라이언트 아이디
GOOGLE_CLIENT_SECRET=구글 클라이언트 Secret

NAVER_CLIENT_ID=네이버 API 아이디
NAVER_CLIENT_SECRET=네이버 API Secret

KAKAO_CLIENT_ID=카카오 API 키
KAKAO_CLIENT_SECRET=카카오 API Secret

FACEBOOK_CLIENT_ID=페이스북 API 아이디
FACEBOOK_CLIENT_SECRET=페이스북 API Secret

IAMPORT_API_KEY=아임포트 API 아이디
IAMPORT_API_SECRET=아임포트 API 키

GCS_BUCKET_NAME=Google Cloud Storage 버킷 이름
GCP_PROJECT_ID=Google Cloud Platform 프로젝트명
GCS_KEY_FILE=Google Cloud Storage 서비스 계정 키파일 이름
GBQ_KEY_FILE=Google BigQuery 서비스 계정 키파일 이름
GBQ_DATASET_NAME=Google BigQuery 데이터셋 명
GBQ_TABLE_NAME=Google BigQuery 테이블 명
IMAGE_URL_PREFIX=Google Cloud Storage Public Access URL Prefix (slice until bucket name)

REDIS_HOST=Redis URI (네임리졸루션 사용)
REDIS_PORT=Redis Port (docker-compose.yaml에서 redis exposed port 참조)

JWT_ACCESS_SECRET=엑세스 토큰 Secret
JWT_REFRESH_SECRET=리프레시 토큰 Secret
```
