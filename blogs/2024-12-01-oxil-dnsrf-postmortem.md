## What I learned from working in a small internet data company

In September 2023, I began working in Oxford Information Labs, a company which produces data analytics software and provides data analysis and policy advice to clients.

The company was quite small when I was working there, with only 4 people in the core team for the DAP (Data Analytics Platform) - me, a grad who started a year before me, my boss (the CTO and creator of the backend), and an experienced frontend engineer. My role was listed as Backend Engineer, and eventually changed to Software Engineer.

### What did I go there to learn?

As well as being a convenient job offer, having just graduated, I went to OXIL for a few reasons. I wanted to learn how a small company is run - what are the pitfalls, what works, what are the important activities and processes? Being at a small company also forces you to "wear many different hats", I had heard, which I expected to mean that I would do software engineering from many different angles.

#### Small company pitfalls
Customer leads are nothing if they don't actually want what you're selling, and it's much easier to convince someone that they want what you're selling in real life than 4 weeks after you've met them on an email.

Fear in your employees is so dangerous. If you've hired properly, your best employees have better opportunities a couple of door-knocks away, and if they are afraid there's stagnation of personal growth or of income, you can quickly fall into turmoil. I think the only way to abate this is to ask for feedback from them regularly (and act on it, of course) and survey the landscape (or prepare a good network) so you're ready to hire replacements.

New employees take a silly amount of time to train to proficiency. It's hard to tell if a good introductory training course would improve this.

Letting things get a bit bad (in the accounting side for example) can cost massive amounts to repair - it really is like a form of debt.

#### What works in a small company?
Being incredibly adaptable to a clients needs is something that I think it's hard for big companies to offer. Sometimes you have been doing something wrong for a long time and you just need to scrap it and try something else. You can do this, it's actually a good thing to do sometimes.

People who are multitalented are worth a crazy amount when specialisation is a farce - one of the team was Brazilian and very charismatic, and he worked wonders on some South American potential clients at a conference we went to... and he was the website designer and video guy!

### Many different hats
One thing I didn't realise was that "many different hats" meant more than doing different types of software engineering. My time was spent as:

- a data analyst (30%)
- a software engineer (25%)
- a data engineer (25%)
- a database administrator (6%)
- a project manager (5%)
- a policy analyst (5%)
- a devops engineer (3%)
- a salesman (1%)

#### Data Analyst
It is vitally important to spot check data that comes in if you're going to draw confident conclusions from in - it's not that hard to do, read the first 100 rows, make a few bar charts, if there's something seriously awry, it will likely appear. For some types of data, it's also important to have a domain expert spot check it. For one of my projects, I found that many internet domains were being "Unregistered". It was only when a domain expert looked at the data and said that was very unlikely that I looked deeper and found that the results from the ICANN mandated WHOIS/RDAP services sometimes just 404 (Page not found) randomly, even if the domain is registered.

#### Data engineer
Data engineering is very hard, tedious, and painful and if I encounter data engineers I should take pity on them and be generous. Testing is still a useful practice for data engineering, but you must be creative and strategic in the types of tests that you write and you must accept that they will always be flaky. Often the parsing and normalisation of scraped data is the hardest part. A nice web API with good docs is at least 10x easier to get useful data out of than a strangely structured webpage that doesn't want to be scraped (if you're manually creating the parser, at least - I think LLMs could help here a lot).

#### General insights
If you are working on the wrong thing, you can easily waste multiple days, weeks, even years of your life. Example: In my free time I made some visualisations for sizing the Turkish solar panel market in Python with a Jupyter notebook - tooling and convenience matters so much. It was so comfortable - almost relaxing - and probably the same speed as using the tools at work, even though I had no experience in seaborn and very little experience using Jupyter notebooks.

Receiving feedback is so important for my stress levels. When I wasn't receiving any constructive criticism for multiple months, I had to constantly stare at my own work and pick holes in it to try and get better, and this was gruelling. Example: I felt one of the projects I was data analyst for wasn't making progress nearly as fast as it should've been, and I frustratedly spent my evening doing a write-up of the flaws in our process (which I never showed anyone) just to try and vent out some of the critical feeling.

Simple is so much better, so much of the time. I thought I was clever, but trying to implement even slightly complex things in a big system is just so much harder than implementing the simple solution, and the truth is that in practice no-one ever cared that it was slightly more flawed - if it's simple you can at least understand what those flaws are. Example: searching for brand infringement in domain names can be done really quite well with a regex.

Bash (and the command line) is sick, even though it's horribly weird.

### Conclusion
I actually enjoyed a lot of the work I did at OXIL, and I think it will turn out to be quite useful for the world. The unrelenting pragmatism has rubbed off on me quite strongly I think, but I think the biggest impacts from it on my life are probably yet to be understood. I'm looking forward to my new role immensely - it's time to really sharpen myself technically.