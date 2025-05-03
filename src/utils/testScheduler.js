const parser = require('cron-parser');
const { spawn } = require('child_process');

class TestScheduler {
  constructor(cronPattern, testSuites) {
    this.cronPattern = cronPattern;
    this.testSuites = Array.isArray(testSuites) ? testSuites : [testSuites];
    this.interval = parser.parseExpression(cronPattern);
  }

  start() {
    console.log(`Test scheduler initialized for suites: ${this.testSuites.join(', ')}`);
    console.log(`Next test run scheduled for: ${this.interval.next().toString()}`);
    
    setInterval(() => {
      const now = new Date();
      const next = this.interval.next();
      
      if (now >= next) {
        this.runTests();
        this.interval = parser.parseExpression(this.cronPattern);
      }
    }, 60000); // Check every minute
  }

  runTests() {
    this.testSuites.forEach(suite => {
      console.log(`Running test suite: ${suite}`);
      const test = spawn('npm', ['test', suite]);

      test.stdout.on('data', (data) => {
        console.log(`Test output (${suite}): ${data}`);
      });

      test.stderr.on('data', (data) => {
        console.error(`Test error (${suite}): ${data}`);
      });

      test.on('close', (code) => {
        console.log(`Test process for ${suite} exited with code ${code}`);
      });
    });
  }
}

// Initialize the scheduler with "0 3 * * *" (3 AM daily) and multiple test suites
const scheduler = new TestScheduler("0 3 * * *", ["payroll", "pos"]);
scheduler.start();

module.exports = TestScheduler;