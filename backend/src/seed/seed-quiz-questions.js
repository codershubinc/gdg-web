/**
 * seed-quiz-questions.js
 * Run once to populate the quizquestions collection.
 *   bun run src/seed/seed-quiz-questions.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import QuizQuestion from '../models/QuizQuestion.js';

const QUESTIONS = [
  // ── JavaScript ──────────────────────────────────────────────────────────────
  { quiz: 'javascript', order: 1,  question: 'Which keyword declares a block-scoped variable?',                                                           options: ['var', 'let', 'function', 'static'],                                                                              answer: 1 },
  { quiz: 'javascript', order: 2,  question: 'What does `typeof null` return?',                                                                           options: ['"null"', '"undefined"', '"object"', '"boolean"'],                                                                answer: 2 },
  { quiz: 'javascript', order: 3,  question: 'Which method converts a JSON string to an object?',                                                         options: ['JSON.parse()', 'JSON.stringify()', 'Object.parse()', 'JSON.decode()'],                                            answer: 0 },
  { quiz: 'javascript', order: 4,  question: 'What is the output of `0.1 + 0.2 === 0.3`?',                                                               options: ['true', 'false', 'undefined', 'NaN'],                                                                             answer: 1 },
  { quiz: 'javascript', order: 5,  question: 'Which higher-order method creates a new array from a transformation?',                                      options: ['filter', 'reduce', 'map', 'find'],                                                                               answer: 2 },
  { quiz: 'javascript', order: 6,  question: 'What does the `===` operator check?',                                                                       options: ['Value only', 'Reference only', 'Value and type', 'Type only'],                                                   answer: 2 },
  { quiz: 'javascript', order: 7,  question: 'Arrow functions have their own `this`?',                                                                    options: ['Yes', 'No', 'Only in strict mode', 'Only when named'],                                                          answer: 1 },
  { quiz: 'javascript', order: 8,  question: 'Which Promise method runs all promises concurrently and waits for ALL to settle (fulfilled or rejected)?',  options: ['Promise.race()', 'Promise.any()', 'Promise.all()', 'Promise.allSettled()'],                                    answer: 3 },
  { quiz: 'javascript', order: 9,  question: 'What does `Array.prototype.splice()` do?',                                                                  options: ['Returns a shallow copy', 'Adds/removes elements in place', 'Sorts the array', 'Flattens nested arrays'],         answer: 1 },
  { quiz: 'javascript', order: 10, question: 'Which statement about closures is correct?',                                                                options: ['A closure forgets its outer scope', 'A closure captures its outer scope', 'Closures only work with var', 'Closures are not possible in async code'], answer: 1 },

  // ── Python ──────────────────────────────────────────────────────────────────
  { quiz: 'python', order: 1,  question: 'Which of these is an immutable data type?',                                  options: ['list', 'dict', 'set', 'tuple'],                                                                                                              answer: 3 },
  { quiz: 'python', order: 2,  question: 'What is the output of `bool("")`?',                                         options: ['True', 'False', 'None', 'Error'],                                                                                                            answer: 1 },
  { quiz: 'python', order: 3,  question: 'How do you activate a virtual environment (venv) on Linux/Mac?',            options: ['python start venv', 'source venv/bin/activate', 'pip activate venv', 'python -m activate'],                                                   answer: 1 },
  { quiz: 'python', order: 4,  question: 'Which keyword is used inside a generator function?',                        options: ['return', 'async', 'yield', 'defer'],                                                                                                         answer: 2 },
  { quiz: 'python', order: 5,  question: 'What does `__init__` do in a class?',                                       options: ['Destroys the object', 'Initialises instance attributes', 'Imports the class', 'Defines a class method'],                                       answer: 1 },
  { quiz: 'python', order: 6,  question: 'Which module is used for regular expressions in Python?',                   options: ['regex', 're', 'rx', 'pattern'],                                                                                                              answer: 1 },
  { quiz: 'python', order: 7,  question: 'List comprehension `[x*2 for x in range(3)]` evaluates to?',               options: ['[0,2,4]', '[1,2,3]', '[2,4,6]', '[0,1,2]'],                                                                                                 answer: 0 },
  { quiz: 'python', order: 8,  question: 'What is the GIL in CPython?',                                              options: ['Global Import Lock', 'Global Interpreter Lock', 'Generic Interface Layer', 'Garbage Iterator Loop'],                                          answer: 1 },
  { quiz: 'python', order: 9,  question: 'Which decorator makes a method a static method?',                           options: ['@classmethod', '@property', '@staticmethod', '@abstractmethod'],                                                                              answer: 2 },
  { quiz: 'python', order: 10, question: '`dict.get(key, default)` when the key is missing returns?',                 options: ['Raises KeyError', 'default value', 'None always', 'False'],                                                                                 answer: 1 },

  // ── Web Dev ─────────────────────────────────────────────────────────────────
  { quiz: 'webdev', order: 1,  question: 'Which HTTP method is idempotent and used to fetch resources?',              options: ['POST', 'PUT', 'GET', 'PATCH'],                                                                                                               answer: 2 },
  { quiz: 'webdev', order: 2,  question: 'What does CSS `position: sticky` do?',                                      options: ['Stays fixed always', 'Scrolls with page until threshold then sticks', 'Removes from flow', 'Snaps to grid'],                                  answer: 1 },
  { quiz: 'webdev', order: 3,  question: 'Which HTML tag defines semantic navigation?',                               options: ['<div>', '<section>', '<nav>', '<header>'],                                                                                                   answer: 2 },
  { quiz: 'webdev', order: 4,  question: 'What is the default display value of a `<span>`?',                          options: ['block', 'flex', 'inline', 'grid'],                                                                                                           answer: 2 },
  { quiz: 'webdev', order: 5,  question: 'CORS stands for?',                                                          options: ['Cross-Origin Resource Sharing', 'Client-Origin Request Standard', 'Cross-Origin Request Service', 'Content-Origin Response Spec'],           answer: 0 },
  { quiz: 'webdev', order: 6,  question: 'Which CSS property controls stacking order?',                               options: ['order', 'z-index', 'stack', 'layer'],                                                                                                        answer: 1 },
  { quiz: 'webdev', order: 7,  question: 'REST is based on which architectural style?',                               options: ['SOAP', 'Stateless client-server', 'Remote Procedure Call', 'Stateful sessions'],                                                             answer: 1 },
  { quiz: 'webdev', order: 8,  question: 'What does `localStorage.setItem()` persist across?',                        options: ['Only current tab', 'Only current session', 'Browser restarts', 'Only HTTPS pages'],                                                          answer: 2 },
  { quiz: 'webdev', order: 9,  question: 'Which HTTP status code means "Not Found"?',                                 options: ['401', '403', '404', '500'],                                                                                                                  answer: 2 },
  { quiz: 'webdev', order: 10, question: 'Which CSS unit is relative to the root font size?',                         options: ['em', 'rem', 'vh', 'px'],                                                                                                                     answer: 1 },

  // ── Cloud & GCP ─────────────────────────────────────────────────────────────
  { quiz: 'cloud', order: 1,  question: 'What does GCP stand for?',                                                   options: ['Global Cloud Platform', 'Google Cloud Platform', 'General Compute Provider', 'Google Core Products'],                                        answer: 1 },
  { quiz: 'cloud', order: 2,  question: 'Firebase Firestore is what type of database?',                               options: ['Relational SQL', 'Document NoSQL', 'Key-value only', 'Graph database'],                                                                       answer: 1 },
  { quiz: 'cloud', order: 3,  question: 'Which GCP service runs containerised apps without managing servers?',        options: ['GKE', 'Cloud Run', 'App Engine Flex', 'Compute Engine'],                                                                                    answer: 1 },
  { quiz: 'cloud', order: 4,  question: 'What is a CDN primarily used for?',                                          options: ['Database replication', 'Serving static assets closer to users', 'Authentication tokens', 'Log aggregation'],                                 answer: 1 },
  { quiz: 'cloud', order: 5,  question: 'What does IAM stand for in cloud?',                                          options: ['Internet Access Management', 'Identity and Access Management', 'Infrastructure App Manager', 'Internal Auth Module'],                        answer: 1 },
  { quiz: 'cloud', order: 6,  question: 'Cloud Functions are an example of?',                                         options: ['IaaS', 'PaaS', 'FaaS', 'SaaS'],                                                                                                              answer: 2 },
  { quiz: 'cloud', order: 7,  question: 'Firebase Authentication supports?',                                          options: ['Only Google sign-in', 'Only email/password', 'Multiple providers including Google, email, phone', 'Only OAuth2'],                            answer: 2 },
  { quiz: 'cloud', order: 8,  question: 'Which GCP service stores unstructured binary objects?',                      options: ['BigQuery', 'Cloud SQL', 'Cloud Storage', 'Spanner'],                                                                                         answer: 2 },
  { quiz: 'cloud', order: 9,  question: 'What does "horizontal scaling" mean?',                                       options: ['Adding RAM to existing server', 'Adding more server instances', 'Increasing CPU speed', 'Expanding disk storage'],                           answer: 1 },
  { quiz: 'cloud', order: 10, question: 'Kubernetes manages?',                                                        options: ['DNS records', 'Container orchestration', 'SSL certificates', 'Code repositories'],                                                           answer: 1 },

  // ── Android ─────────────────────────────────────────────────────────────────
  { quiz: 'android', order: 1,  question: 'Default language for modern Android development?',                         options: ['Java', 'Kotlin', 'Swift', 'Dart'],                                                                                                           answer: 1 },
  { quiz: 'android', order: 2,  question: 'Which Jetpack component manages UI-related data lifecycle-aware?',         options: ['LiveData', 'ViewModel', 'Room', 'WorkManager'],                                                                                              answer: 1 },
  { quiz: 'android', order: 3,  question: 'What is an Activity in Android?',                                          options: ['A background task', 'A single screen with UI', 'A service runner', 'A data class'],                                                          answer: 1 },
  { quiz: 'android', order: 4,  question: 'Which file defines app permissions?',                                      options: ['build.gradle', 'strings.xml', 'AndroidManifest.xml', 'proguard-rules.pro'],                                                                  answer: 2 },
  { quiz: 'android', order: 5,  question: 'Jetpack Compose is?',                                                      options: ['A REST client', 'A declarative UI toolkit', 'An animation library', 'A dependency injection library'],                                       answer: 1 },
  { quiz: 'android', order: 6,  question: 'Room is an abstraction over?',                                             options: ['SharedPreferences', 'SQLite', 'Firebase', 'ContentProvider'],                                                                                answer: 1 },
  { quiz: 'android', order: 7,  question: 'Which coroutine scope is tied to a ViewModel lifecycle?',                  options: ['GlobalScope', 'lifecycleScope', 'viewModelScope', 'MainScope'],                                                                              answer: 2 },
  { quiz: 'android', order: 8,  question: 'What does `Intent` do in Android?',                                        options: ['Stores preferences', 'Messaging object for component communication', 'Handles HTTP requests', 'Manages databases'],                           answer: 1 },
  { quiz: 'android', order: 9,  question: 'Hilt is used for?',                                                        options: ['HTTP networking', 'Dependency injection', 'Image loading', 'Push notifications'],                                                            answer: 1 },
  { quiz: 'android', order: 10, question: 'Which lifecycle method is called when an Activity becomes visible?',       options: ['onCreate()', 'onStart()', 'onResume()', 'onPause()'],                                                                                        answer: 1 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  // Drop existing questions and re-insert (idempotent)
  await QuizQuestion.deleteMany({});
  console.log('Cleared existing quiz questions');

  await QuizQuestion.insertMany(QUESTIONS);
  console.log(`Inserted ${QUESTIONS.length} questions across ${new Set(QUESTIONS.map(q => q.quiz)).size} tracks`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
