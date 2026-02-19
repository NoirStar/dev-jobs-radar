// ============================================================
// 기술 키워드 사전 — 500+ 기술 키워드 (카테고리별 분류)
// 채용공고에서 기술 스택을 자동 추출하는 데 사용
// ============================================================

import type { SkillDictionaryEntry, SkillCategory } from '@/types/skill'

/** 기술 사전 원본 데이터: { 표준명: 별칭[] } */
type RawDictionary = Record<string, Record<string, string[]>>

const RAW_SKILLS: Record<SkillCategory, Record<string, string[]>> = {
  // ────────────────────────────────────────────
  // 프로그래밍 언어
  // ────────────────────────────────────────────
  languages: {
    Java: ['java', 'jdk', 'jvm', 'openjdk'],
    Python: ['python', 'python3', 'py'],
    JavaScript: ['javascript', 'js', 'ecmascript', 'es6', 'es2015'],
    TypeScript: ['typescript', 'ts'],
    Go: ['go', 'golang'],
    Rust: ['rust', 'rustlang'],
    'C++': ['c++', 'cpp', 'cplusplus'],
    C: ['c language', 'clang'],
    'C#': ['c#', 'csharp', 'c-sharp'],
    Kotlin: ['kotlin', 'kt'],
    Swift: ['swift'],
    Scala: ['scala'],
    Ruby: ['ruby', 'rb'],
    PHP: ['php', 'php8', 'php7'],
    Dart: ['dart'],
    Elixir: ['elixir'],
    Clojure: ['clojure', 'clj'],
    Haskell: ['haskell'],
    Lua: ['lua'],
    Perl: ['perl'],
    R: ['r language', 'rlang'],
    Julia: ['julia'],
    Groovy: ['groovy'],
    'Objective-C': ['objective-c', 'objc', 'obj-c'],
    COBOL: ['cobol'],
    Fortran: ['fortran'],
    Assembly: ['assembly', 'asm'],
    Shell: ['shell', 'bash', 'sh', 'zsh'],
    PowerShell: ['powershell', 'pwsh'],
    SQL: ['sql'],
  },

  // ────────────────────────────────────────────
  // 프론트엔드
  // ────────────────────────────────────────────
  frontend: {
    React: ['react', 'reactjs', 'react.js'],
    Vue: ['vue', 'vuejs', 'vue.js', 'vue3', 'vue2'],
    Angular: ['angular', 'angularjs'],
    Svelte: ['svelte', 'sveltekit'],
    'Next.js': ['next.js', 'nextjs', 'next'],
    'Nuxt.js': ['nuxt', 'nuxtjs', 'nuxt.js'],
    Remix: ['remix'],
    Astro: ['astro'],
    Gatsby: ['gatsby', 'gatsbyjs'],
    jQuery: ['jquery'],
    Redux: ['redux', 'redux-toolkit', 'rtk'],
    Zustand: ['zustand'],
    MobX: ['mobx'],
    Recoil: ['recoil'],
    Jotai: ['jotai'],
    Pinia: ['pinia'],
    Vuex: ['vuex'],
    'React Query': ['react-query', 'tanstack-query', 'tanstack query'],
    SWR: ['swr'],
    'Tailwind CSS': ['tailwindcss', 'tailwind', 'tailwind css'],
    'Styled Components': ['styled-components', 'styled components'],
    Emotion: ['emotion', '@emotion'],
    Sass: ['sass', 'scss'],
    CSS: ['css', 'css3'],
    'CSS Modules': ['css modules', 'css-modules'],
    Webpack: ['webpack'],
    Vite: ['vite', 'vitejs'],
    Rollup: ['rollup'],
    esbuild: ['esbuild'],
    Turbopack: ['turbopack'],
    Babel: ['babel', 'babeljs'],
    Storybook: ['storybook'],
    'Three.js': ['three.js', 'threejs'],
    D3: ['d3', 'd3.js', 'd3js'],
    'Chart.js': ['chart.js', 'chartjs'],
    Recharts: ['recharts'],
    'Framer Motion': ['framer-motion', 'framer motion'],
    PWA: ['pwa', 'progressive web app'],
    WebRTC: ['webrtc'],
    WebGL: ['webgl'],
    Canvas: ['canvas', 'html5 canvas'],
    'Web Components': ['web components', 'web-components'],
    'Micro Frontend': ['micro frontend', 'micro-frontend', 'microfrontend'],
  },

  // ────────────────────────────────────────────
  // 백엔드
  // ────────────────────────────────────────────
  backend: {
    Spring: ['spring', 'spring boot', 'springboot', 'spring-boot'],
    'Spring Cloud': ['spring cloud', 'spring-cloud'],
    'Spring Batch': ['spring batch', 'spring-batch'],
    'Node.js': ['node.js', 'nodejs', 'node'],
    Express: ['express', 'expressjs', 'express.js'],
    NestJS: ['nestjs', 'nest.js', 'nest'],
    Fastify: ['fastify'],
    Koa: ['koa', 'koajs'],
    Django: ['django'],
    FastAPI: ['fastapi', 'fast-api'],
    Flask: ['flask'],
    'Ruby on Rails': ['rails', 'ruby on rails', 'ror'],
    Laravel: ['laravel'],
    'ASP.NET': ['asp.net', 'aspnet', '.net core', 'dotnet'],
    Gin: ['gin', 'gin-gonic'],
    Echo: ['echo'],
    Fiber: ['fiber'],
    Actix: ['actix', 'actix-web'],
    Phoenix: ['phoenix'],
    'Ktor': ['ktor'],
    Micronaut: ['micronaut'],
    Quarkus: ['quarkus'],
    'gRPC': ['grpc', 'g-rpc'],
    GraphQL: ['graphql', 'gql'],
    REST: ['rest', 'restful', 'rest api', 'restapi'],
    WebSocket: ['websocket', 'ws', 'socket.io'],
    OAuth: ['oauth', 'oauth2', 'oauth 2.0'],
    JWT: ['jwt', 'json web token'],
    MSA: ['msa', 'microservice', 'microservices', '마이크로서비스'],
    'Event Driven': ['event-driven', 'event driven', 'eda'],
    CQRS: ['cqrs'],
    DDD: ['ddd', 'domain driven design', 'domain-driven'],
    'Clean Architecture': ['clean architecture', 'clean-architecture'],
    Hexagonal: ['hexagonal', 'hexagonal architecture'],
  },

  // ────────────────────────────────────────────
  // 데이터베이스
  // ────────────────────────────────────────────
  database: {
    MySQL: ['mysql', 'mariadb'],
    PostgreSQL: ['postgresql', 'postgres', 'pg'],
    Oracle: ['oracle', 'oracle db', 'oracledb'],
    'SQL Server': ['sql server', 'mssql', 'ms sql'],
    SQLite: ['sqlite', 'sqlite3'],
    MongoDB: ['mongodb', 'mongo'],
    Redis: ['redis'],
    Elasticsearch: ['elasticsearch', 'elastic', 'es'],
    DynamoDB: ['dynamodb', 'dynamo'],
    Cassandra: ['cassandra'],
    CouchDB: ['couchdb'],
    Neo4j: ['neo4j'],
    InfluxDB: ['influxdb', 'influx'],
    TimescaleDB: ['timescaledb'],
    ClickHouse: ['clickhouse'],
    Supabase: ['supabase'],
    Firebase: ['firebase', 'firestore'],
    PlanetScale: ['planetscale'],
    CockroachDB: ['cockroachdb', 'cockroach'],
    'Amazon RDS': ['rds', 'amazon rds'],
    'Amazon Aurora': ['aurora', 'amazon aurora'],
    Memcached: ['memcached'],
    Druid: ['druid', 'apache druid'],
    HBase: ['hbase'],
    Couchbase: ['couchbase'],
  },

  // ────────────────────────────────────────────
  // DevOps / 인프라 / 클라우드
  // ────────────────────────────────────────────
  devops: {
    Docker: ['docker', 'dockerfile', 'docker-compose'],
    Kubernetes: ['kubernetes', 'k8s', 'kubectl'],
    AWS: ['aws', 'amazon web services'],
    GCP: ['gcp', 'google cloud', 'google cloud platform'],
    Azure: ['azure', 'microsoft azure'],
    NCP: ['ncp', 'naver cloud', 'naver cloud platform'],
    Terraform: ['terraform', 'tf'],
    Ansible: ['ansible'],
    Puppet: ['puppet'],
    Chef: ['chef'],
    Jenkins: ['jenkins'],
    'GitHub Actions': ['github actions', 'github-actions', 'gh actions'],
    'GitLab CI': ['gitlab ci', 'gitlab-ci', 'gitlab ci/cd'],
    CircleCI: ['circleci', 'circle ci'],
    'Travis CI': ['travis ci', 'travis-ci'],
    ArgoCD: ['argocd', 'argo cd', 'argo-cd'],
    Flux: ['fluxcd', 'flux'],
    Prometheus: ['prometheus'],
    Grafana: ['grafana'],
    Datadog: ['datadog'],
    'New Relic': ['new relic', 'newrelic'],
    ELK: ['elk', 'elk stack', 'elastic stack'],
    Logstash: ['logstash'],
    Kibana: ['kibana'],
    Fluentd: ['fluentd'],
    Jaeger: ['jaeger'],
    Istio: ['istio'],
    Envoy: ['envoy'],
    Nginx: ['nginx'],
    Apache: ['apache', 'httpd', 'apache http'],
    HAProxy: ['haproxy'],
    Traefik: ['traefik'],
    Vault: ['vault', 'hashicorp vault'],
    Consul: ['consul'],
    Packer: ['packer'],
    Pulumi: ['pulumi'],
    CDK: ['cdk', 'aws cdk'],
    CloudFormation: ['cloudformation', 'cfn'],
    'EC2': ['ec2', 'amazon ec2'],
    'S3': ['s3', 'amazon s3'],
    Lambda: ['lambda', 'aws lambda'],
    ECS: ['ecs', 'amazon ecs'],
    EKS: ['eks', 'amazon eks'],
    Fargate: ['fargate'],
    CloudFront: ['cloudfront'],
    Route53: ['route53', 'route 53'],
    VPC: ['vpc'],
    IAM: ['iam'],
    SQS: ['sqs', 'amazon sqs'],
    SNS: ['sns', 'amazon sns'],
    'Cloud Run': ['cloud run'],
    'Cloud Functions': ['cloud functions'],
    GKE: ['gke'],
    AKS: ['aks'],
    Vercel: ['vercel'],
    Netlify: ['netlify'],
    Heroku: ['heroku'],

  },

  // ────────────────────────────────────────────
  // 메시징 / 스트리밍
  // ────────────────────────────────────────────
  messaging: {
    Kafka: ['kafka', 'apache kafka'],
    RabbitMQ: ['rabbitmq', 'rabbit mq'],
    'Amazon SQS': ['sqs', 'amazon sqs'],
    'Amazon SNS': ['sns', 'amazon sns'],
    'Amazon Kinesis': ['kinesis', 'amazon kinesis'],
    'Google Pub/Sub': ['pub/sub', 'pubsub', 'google pub/sub'],
    NATS: ['nats'],
    ZeroMQ: ['zeromq', 'zmq', '0mq'],
    MQTT: ['mqtt'],
    'Apache Pulsar': ['pulsar', 'apache pulsar'],
    ActiveMQ: ['activemq', 'active mq'],
    Celery: ['celery'],
    Sidekiq: ['sidekiq'],
    'Bull': ['bull', 'bullmq'],
  },

  // ────────────────────────────────────────────
  // AI / ML / 데이터
  // ────────────────────────────────────────────
  ai_ml: {
    TensorFlow: ['tensorflow', 'tf'],
    PyTorch: ['pytorch', 'torch'],
    scikit_learn: ['scikit-learn', 'sklearn', 'scikit learn'],
    Keras: ['keras'],
    Pandas: ['pandas'],
    NumPy: ['numpy'],
    OpenCV: ['opencv', 'cv2'],
    LLM: ['llm', 'large language model'],
    GPT: ['gpt', 'chatgpt', 'gpt-4', 'gpt-3'],
    'OpenAI API': ['openai', 'openai api'],
    RAG: ['rag', 'retrieval augmented generation'],
    LangChain: ['langchain', 'lang chain'],
    LlamaIndex: ['llamaindex', 'llama index'],
    'Hugging Face': ['huggingface', 'hugging face', 'hf'],
    BERT: ['bert'],
    Transformers: ['transformers'],
    'Stable Diffusion': ['stable diffusion', 'stable-diffusion'],
    MLflow: ['mlflow', 'ml flow'],
    Kubeflow: ['kubeflow', 'kube flow'],
    Airflow: ['airflow', 'apache airflow'],
    Spark: ['spark', 'apache spark', 'pyspark'],
    Hadoop: ['hadoop', 'hdfs'],
    Flink: ['flink', 'apache flink'],
    dbt: ['dbt'],
    Snowflake: ['snowflake'],
    BigQuery: ['bigquery', 'big query'],
    Redshift: ['redshift', 'amazon redshift'],
    Databricks: ['databricks'],
    Jupyter: ['jupyter', 'jupyter notebook'],
    CUDA: ['cuda', 'nvidia cuda'],
    'TensorRT': ['tensorrt'],
    ONNX: ['onnx'],
    NLP: ['nlp', 'natural language processing', '자연어처리'],
    'Computer Vision': ['computer vision', 'cv', '컴퓨터비전'],
    'Reinforcement Learning': ['reinforcement learning', 'rl', '강화학습'],
    'Recommendation': ['recommendation', 'recommendation system', '추천시스템'],
    'Data Pipeline': ['data pipeline', 'etl', 'elt'],
    'Feature Store': ['feature store'],
    'Model Serving': ['model serving'],
    Vector_DB: ['vector db', 'vector database', 'pinecone', 'weaviate', 'milvus', 'chroma'],
  },

  // ────────────────────────────────────────────
  // 모바일
  // ────────────────────────────────────────────
  mobile: {
    iOS: ['ios'],
    Android: ['android'],
    SwiftUI: ['swiftui', 'swift ui'],
    UIKit: ['uikit', 'ui kit'],
    'Jetpack Compose': ['jetpack compose', 'compose'],
    Flutter: ['flutter'],
    'React Native': ['react native', 'react-native', 'rn'],
    Xamarin: ['xamarin'],
    'Kotlin Multiplatform': ['kmp', 'kotlin multiplatform', 'kmm'],
    Capacitor: ['capacitor'],
    Ionic: ['ionic'],
    CoreData: ['coredata', 'core data'],
    Room: ['room', 'room db'],
    Realm: ['realm'],
    'App Store': ['app store', 'appstore'],
    'Google Play': ['google play', 'play store'],
    'Push Notification': ['push notification', 'fcm', 'apns'],
  },

  // ────────────────────────────────────────────
  // 테스팅
  // ────────────────────────────────────────────
  testing: {
    Jest: ['jest'],
    Vitest: ['vitest'],
    Mocha: ['mocha'],
    Chai: ['chai'],
    Cypress: ['cypress'],
    Playwright: ['playwright'],
    Selenium: ['selenium', 'selenium webdriver'],
    JUnit: ['junit', 'junit5'],
    TestNG: ['testng'],
    pytest: ['pytest'],
    'React Testing Library': ['testing-library', 'react testing library', 'rtl'],
    Enzyme: ['enzyme'],
    Puppeteer: ['puppeteer'],
    'k6': ['k6'],
    JMeter: ['jmeter', 'apache jmeter'],
    Gatling: ['gatling'],
    Locust: ['locust'],
    'Load Testing': ['load testing', '부하 테스트'],
    TDD: ['tdd', 'test driven development'],
    BDD: ['bdd', 'behavior driven development'],
    'E2E Testing': ['e2e', 'e2e testing', 'end-to-end'],
    'Unit Testing': ['unit testing', 'unit test', '단위 테스트'],
    'Integration Testing': ['integration testing', 'integration test', '통합 테스트'],
    Mockito: ['mockito'],
    Chromatic: ['chromatic'],
  },

  // ────────────────────────────────────────────
  // 도구
  // ────────────────────────────────────────────
  tools: {
    Git: ['git'],
    GitHub: ['github'],
    GitLab: ['gitlab'],
    Bitbucket: ['bitbucket'],
    Jira: ['jira'],
    Confluence: ['confluence'],
    Notion: ['notion'],
    Slack: ['slack'],
    Figma: ['figma'],
    Swagger: ['swagger', 'openapi'],
    Postman: ['postman'],
    VS_Code: ['vscode', 'vs code', 'visual studio code'],
    IntelliJ: ['intellij', 'intellij idea'],
    Vim: ['vim', 'neovim', 'nvim'],
    'npm': ['npm'],
    Yarn: ['yarn'],
    pnpm: ['pnpm'],
    ESLint: ['eslint'],
    Prettier: ['prettier'],
    Husky: ['husky'],
    'Lint Staged': ['lint-staged', 'lint staged'],
    'Sentry': ['sentry'],
    Amplitude: ['amplitude'],
    'Google Analytics': ['google analytics', 'ga', 'ga4'],
    Mixpanel: ['mixpanel'],
    Hotjar: ['hotjar'],
    Segment: ['segment'],
    LaunchDarkly: ['launchdarkly', 'launch darkly'],
    'Feature Flag': ['feature flag', 'feature toggle'],
  },

  // ────────────────────────────────────────────
  // 방법론 / 아키텍처
  // ────────────────────────────────────────────
  methodology: {
    Agile: ['agile', '애자일'],
    Scrum: ['scrum', '스크럼'],
    Kanban: ['kanban', '칸반'],
    'CI/CD': ['ci/cd', 'cicd', 'ci cd', '지속적 통합'],
    DevOps: ['devops', 'dev ops'],
    GitOps: ['gitops', 'git ops'],
    'Infrastructure as Code': ['iac', 'infrastructure as code'],
    'Site Reliability': ['sre', 'site reliability'],
    'Code Review': ['code review', '코드 리뷰'],
    'Pair Programming': ['pair programming', '페어 프로그래밍'],
    'Design Pattern': ['design pattern', '디자인 패턴'],
    SOLID: ['solid', 'solid principle'],
    OOP: ['oop', 'object oriented', '객체지향'],
    FP: ['fp', 'functional programming', '함수형 프로그래밍'],
    'Reactive Programming': ['reactive', '리액티브'],
    'Monorepo': ['monorepo', 'mono repo'],
    'Trunk Based': ['trunk based', 'trunk-based development'],
  },

  // ────────────────────────────────────────────
  // OS / 시스템
  // ────────────────────────────────────────────
  os: {
    Linux: ['linux', 'ubuntu', 'centos', 'rhel', 'debian', 'fedora'],
    Windows: ['windows', 'win32', 'win64', 'windows server'],
    macOS: ['macos', 'mac os', 'osx'],
    'Device Driver': ['device driver', 'driver development', '드라이버'],
    Kernel: ['kernel', '커널'],
    Embedded: ['embedded', '임베디드'],
    RTOS: ['rtos', 'real-time os'],
    Firmware: ['firmware', '펌웨어'],
    IoT: ['iot', 'internet of things', '사물인터넷'],
    'System Programming': ['system programming', '시스템 프로그래밍'],
    'Network Programming': ['network programming', '네트워크 프로그래밍'],
    TCP_IP: ['tcp/ip', 'tcp', 'udp', 'socket programming'],
  },

  // ────────────────────────────────────────────
  // 기타
  // ────────────────────────────────────────────
  other: {
    Blockchain: ['blockchain', '블록체인'],
    'Smart Contract': ['smart contract', 'solidity'],
    Ethereum: ['ethereum', 'eth'],
    Web3: ['web3', 'web 3.0'],
    AR: ['ar', 'augmented reality'],
    VR: ['vr', 'virtual reality'],
    XR: ['xr', 'extended reality'],
    Metaverse: ['metaverse', '메타버스'],
    'Low Code': ['low code', 'low-code', '로우코드'],
    'No Code': ['no code', 'no-code', '노코드'],
    RPA: ['rpa', 'robotic process automation'],
    'Digital Twin': ['digital twin', '디지털 트윈'],
    'Edge Computing': ['edge computing', '엣지 컴퓨팅'],
    '5G': ['5g'],
    Quantum: ['quantum', 'quantum computing', '양자 컴퓨팅'],
  },
}

// ────────────────────────────────────────────
// 사전 빌드
// ────────────────────────────────────────────

/** 기술 사전 엔트리 목록 */
export const SKILL_DICTIONARY: SkillDictionaryEntry[] = Object.entries(RAW_SKILLS).flatMap(
  ([category, skills]) =>
    Object.entries(skills).map(([name, aliases]) => ({
      name,
      category: category as SkillCategory,
      aliases,
    })),
)

/** 별칭 → 표준명 매핑 (역방향 룩업용) */
export const ALIAS_TO_SKILL: Map<string, string> = new Map(
  SKILL_DICTIONARY.flatMap((entry) =>
    entry.aliases.map((alias) => [alias.toLowerCase(), entry.name] as [string, string]),
  ),
)

/** 표준명 → 카테고리 매핑 */
export const SKILL_TO_CATEGORY: Map<string, SkillCategory> = new Map(
  SKILL_DICTIONARY.map((entry) => [entry.name, entry.category]),
)

/** 총 기술 수 */
export const TOTAL_SKILLS = SKILL_DICTIONARY.length

/** 카테고리별 기술 목록 */
export function getSkillsByCategory(category: SkillCategory): SkillDictionaryEntry[] {
  return SKILL_DICTIONARY.filter((s) => s.category === category)
}

/** 별칭으로 표준명 조회 */
export function resolveSkillAlias(alias: string): string | null {
  return ALIAS_TO_SKILL.get(alias.toLowerCase()) ?? null
}
