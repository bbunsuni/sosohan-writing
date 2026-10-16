# 배포 가이드 (Vercel + Neon Postgres)

## 1. Vercel 프로젝트 만들기

1. https://vercel.com/new 에서 GitHub의 `sosohan-writing` 리포를 **Import** 합니다.
2. Framework는 Next.js로 자동 인식됩니다. 빌드 설정은 그대로 둡니다.
   - `package.json`의 `vercel-build` 스크립트가 **DB 마이그레이션 → 빌드**를 자동으로 실행합니다.

## 2. 데이터베이스 연결

1. Vercel 프로젝트 → **Storage** → **Create Database** → **Neon (Postgres)** 선택 → 프로젝트에 연결합니다.
2. 연결하면 `DATABASE_URL` 환경 변수가 자동으로 추가됩니다.

## 3. 환경 변수 (Settings → Environment Variables)

| 이름 | 값 |
| --- | --- |
| `AUTH_SECRET` | `npx auth secret` 또는 `openssl rand -base64 32` 로 만든 값 |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google Cloud Console → OAuth 클라이언트 |
| `AUTH_KAKAO_ID`, `AUTH_KAKAO_SECRET` | Kakao Developers → 내 애플리케이션 (REST API 키 / Client Secret) |

- `AUTH_DEV_LOGIN`은 **넣지 않습니다.** 닉네임만으로 누구나 다른 사람으로 로그인할 수 있게 됩니다.
- Google과 카카오 중 최소 하나는 있어야 로그인할 수 있습니다.

### OAuth 리디렉션 URI

배포 주소가 `https://sosohan-writing.vercel.app`이라면:

- Google: `https://sosohan-writing.vercel.app/api/auth/callback/google`
- 카카오: `https://sosohan-writing.vercel.app/api/auth/callback/kakao`
  (카카오 로그인 활성화, 동의항목에서 닉네임·프로필 사진 설정)

## 4. 배포 후 기본 주제 넣기

로컬에서 운영 DB 주소로 한 번만 실행합니다.

```bash
DATABASE_URL="<Neon 연결 문자열>" npm run db:seed
```

## 5. 이후 배포

`main` 브랜치에 푸쉬하면 Vercel이 자동으로 다시 배포합니다.
