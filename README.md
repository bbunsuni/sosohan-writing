# 함께의 소소한 글쓰기

일상에서 소소하게 쓰는 글을 모아두고, 같은 주제의 이야기를 다른 사람들과 소소하게 나누는 웹서비스입니다.

## 주요 기능 (계획)

- **내 글 서랍** — 나만 보기(🔒) 글을 차곡차곡 모아두기
- **주제** — 같은 주제(#오늘의 한 줄, #출퇴근길 …)로 쓴 글을 함께 보기
- **함께 나누기** — 글을 공개하고, 🌱 공감과 💬 댓글로 소소하게 소통
- **소셜 로그인** — Google, Kakao

## 기술 스택

| 영역 | 선택 | 이유 |
| --- | --- | --- |
| 프레임워크 | [Next.js 16](https://nextjs.org) (App Router) + TypeScript | 화면과 서버 로직을 한 프로젝트에서, 글 페이지 SEO에 유리한 서버 렌더링 |
| 스타일 | Tailwind CSS 4 | 빠른 UI 작업, 라이트/다크 테마 토큰 |
| DB | PostgreSQL + [Prisma 7](https://www.prisma.io) | 사용자·글·주제·댓글의 관계형 데이터에 적합, 타입 안전한 쿼리 |
| 인증 | [Auth.js](https://authjs.dev) (next-auth v5) | Google·Kakao OAuth, Prisma 어댑터로 세션 저장 |
| 검증 | zod | 글/댓글 입력 검증 |
| 배포 (권장) | Vercel + 관리형 Postgres (Neon, Supabase 등) | Next.js와 궁합이 가장 좋음 |

## 디렉토리 구조

```
.
├── prisma/
│   ├── schema.prisma        # 데이터 모델 (User, Topic, Post, Comment, Empathy, Auth 모델)
│   └── seed.ts              # 기본 주제 시드
├── prisma.config.ts         # Prisma 설정 (DATABASE_URL, 마이그레이션, 시드)
├── src/
│   ├── app/                 # 라우트 (App Router)
│   │   ├── page.tsx         # 홈
│   │   ├── topics/          # 주제 목록, 주제별 글
│   │   ├── posts/[id]/      # 글 상세
│   │   ├── write/           # 글쓰기
│   │   ├── me/              # 내 글 서랍
│   │   └── api/auth/        # Auth.js 라우트
│   ├── components/          # 공용 UI 컴포넌트
│   ├── lib/
│   │   ├── prisma.ts        # Prisma 클라이언트
│   │   ├── validations.ts   # zod 스키마
│   │   └── sample-data.ts   # DB 연동 전 화면용 샘플 데이터 (임시)
│   ├── generated/prisma/    # prisma generate 결과물 (git 제외)
│   └── auth.ts              # Auth.js 설정
├── docker-compose.yml       # 로컬 PostgreSQL
└── .env.example
```

## 시작하기

```bash
# 1. 의존성 설치 (postinstall에서 Prisma Client 생성)
npm install

# 2. 환경 변수
cp .env.example .env
npx auth secret            # AUTH_SECRET 생성

# 3. 로컬 DB 실행 및 마이그레이션
docker compose up -d
npm run db:migrate
npm run db:seed

# 4. 개발 서버
npm run dev                # http://localhost:3000
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` / `npm start` | 프로덕션 빌드 / 실행 |
| `npm run lint` / `npm run typecheck` | 린트 / 타입 검사 |
| `npm run db:migrate` | 스키마 변경 → 마이그레이션 생성·적용 |
| `npm run db:seed` | 기본 주제 데이터 넣기 |
| `npm run db:studio` | Prisma Studio로 데이터 보기 |

## 현재 상태

화면 골격(홈, 주제, 글 상세, 글쓰기, 내 글 서랍)과 데이터 모델·인증 설정까지 구성되어 있습니다.
페이지는 아직 `src/lib/sample-data.ts`의 샘플 데이터를 보여주며, 다음 단계에서 Prisma 쿼리와 Server Actions로 교체합니다.
