const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/\} = \{\};/, `} = {
  products: [],
  vendors: [],
  deliveryExecutives: [],
  orders: [],
  passwords: {},
  accountPasswordChangedAt: {},
  coupons: [],
  lastUpdated: 0
};`);
fs.writeFileSync('server.ts', code);
