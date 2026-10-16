# 배포 가이드 (Vercel + Neon Postgres)

## 1. Vercel 프로젝트 만들기

1. https://vercel.com/new 에서 GitHub의 `sosohan-writing` 리포를 **Import** 합니다.
2. Framework는 Next.js로 자동 인식됩니다. 빌드 설정은 그대로 둡니다.
   - `package.json`의 `vercel-build` 스크립트가 **DB 마이그레이션 → 기본 주제 넣기 → 빌드**를 자동으로 실행합니다.

## 2. 데이터베이스 연결

1. Vercel 프로젝트 → **Storage** → **Create Database** → **Neon (Postgres)** 선택 → 프로젝트에 연결합니다.
2. 연결하면 `DATABASE_URL` 환경 변수가 자동으로 추가됩니다.

## 3. 환경 변수 (Settings → Environment Variables)

| 이름 | 값 |
| --- | --- |
| `AUTH_SECRET` | `npx auth secret` 또는 `openssl rand -base64 32` 로 만든 값 |

로그인은 닉네임+비밀번호로 동작하므로 **필수 환경 변수는 `AUTH_SECRET` 하나**입니다.

### (선택) Google / 카카오 로그인

`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_KAKAO_ID`, `AUTH_KAKAO_SECRET`을 추가하면 로그인 버튼이 생깁니다.
배포 주소가 `https://sosohan-writing.vercel.app`이라면 리디렉션 URI는 다음과 같습니다.

- Google: `https://sosohan-writing.vercel.app/api/auth/callback/google`
- 카카오: `https://sosohan-writing.vercel.app/api/auth/callback/kakao`

## 4. 이후 배포

`main` 브랜치에 푸쉬하면 Vercel이 자동으로 다시 배포합니다.
