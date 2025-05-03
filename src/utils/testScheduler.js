const parser = require('cron-parser');
const { spawn } = require('child_process');

class TestScheduler {
  constructor(cronPattern, testSuite) {
    this.cronPattern = cronPattern;
    this.testSuite = testSuite;
    this.interval = parser.parseExpression(cronPattern);
  }

  start() {
    console.log(`Test scheduler initialized for "${this.testSuite}" suite`);
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
    console.log(`Running test suite: ${this.testSuite}`);
    const test = spawn('npm', ['test', this.testSuite]);

    test.stdout.on('data', (data) => {
      console.log(`Test output: ${data}`);
    });

    test.stderr.on('data', (data) => {
      console.error(`Test error: ${data}`);
    });

    test.on('close', (code) => {
      console.log(`Test process exited with code ${code}`);
    });
  }
}

// Initialize the scheduler with "0 3 * * *" (3 AM daily) and "pos-restaurant" test suite
const scheduler = new TestScheduler("0 3 * * *", "pos-restaurant");
scheduler.start();

module.exports = TestScheduler;