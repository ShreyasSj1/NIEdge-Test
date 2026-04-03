const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

c = c.replace(
  '"jobTitle": "Co-Founder & Developer",\r\n            "affiliation"',
  '"jobTitle": "Co-Founder & Developer",\r\n            "image": "https://niedge.vercel.app/assets/images/vansh-gupta-niedge-cofounder.jpg",\r\n            "description": "Co-Founder and Web Architect of NIEdge, a student academic resource platform for NIE students.",\r\n            "affiliation"'
);

c = c.replace(
  '"jobTitle": "Co-Founder & UI/UX Designer",\r\n            "affiliation"',
  '"jobTitle": "Co-Founder & UI/UX Designer",\r\n            "image": "https://niedge.vercel.app/assets/images/shreyas-sj-niedge-cofounder.jpg",\r\n            "description": "Co-Founder and UI/UX Designer of NIEdge, a student academic resource platform for NIE students.",\r\n            "affiliation"'
);

c = c.replace('assets/images/vansh.jpg', 'assets/images/vansh-gupta-niedge-cofounder.jpg');
c = c.replace('assets/images/sj.jpg', 'assets/images/shreyas-sj-niedge-cofounder.jpg');

// Schema markup for About section
c = c.replace(
  '<div class="member">\r\n            <div class="member-card"',
  '<div class="member" itemscope itemtype="https://schema.org/Person">\r\n            <div class="member-card"'
);
c = c.replace(
  '<div class="member">\r\n            <div class="member-card"',
  '<div class="member" itemscope itemtype="https://schema.org/Person">\r\n            <div class="member-card"'
);

c = c.replace('<h3>Vansh Gupta</h3>', '<h3 itemprop="name">Vansh Gupta</h3>');
c = c.replace('<h3>Shreyas S J</h3>', '<h3 itemprop="name">Shreyas S J</h3>');
c = c.replace('<span class="role">Tech Guy</span>', '<span class="role" itemprop="jobTitle">Tech Guy</span>');
c = c.replace('<span class="role">Design Guy</span>', '<span class="role" itemprop="jobTitle">Design Guy</span>');

fs.writeFileSync('index.html', c, 'utf8');
console.log('index.html updated successfully');
