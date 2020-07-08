# Chatapp GLU
Realtime chat app voor GLU gemaakt met: Node.js, Socket.io, Postgres, 

## Demo

https://chatapp-glu.herokuapp.com/

## Usage
```
Altijd eerst 'npm install'

daarna kun je lokaal draaien via: 
npm run dev (d.m.v nodemon),
npm start
gebruik 'npm run watch' om de scss te compilen

url: http://localhost:3000/
```

## Notes
Things to add and/or fix:

- 'Get Chats', chats worden al inserted naar database, maar nog niet opgehaald. -FIXED
- 'Get Active user'. nog niet implemented.
- 'Online Status', nog niet uit hoe ik dat moet uitwerken.
- 'Mobile Friendly', website is al responsive, maar chat niet toegankelijk voor mobiele gebruikers -FIXED
- 'Username check', users worden nog niet opgeslagen in een database, waardoor ze niet verifieerd kunnen worden.
- 'Webpack intergration' -FIXED gebruik gemaakt van Laravel Mix
