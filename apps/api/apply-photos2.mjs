import pg from 'pg'; import fs from 'node:fs'; import path from 'node:path'; import 'dotenv/config';
const UPLOADS='/var/www/satweb/apps/api/uploads', PUB='https://api.satsolutions.uz/uploads';
const SRC='/tmp/dphotos';
const c=new pg.Client(process.env.DATABASE_URL); await c.connect();
const dir=path.join(UPLOADS,'dahua','products'); fs.mkdirSync(dir,{recursive:true});
const files=fs.readdirSync(SRC).filter(f=>f.endsWith('.webp'));
let upd=0, nodb=0;
for(const f of files){
  const slug=f.replace(/\.webp$/,'');
  fs.copyFileSync(path.join(SRC,f), path.join(dir,f));
  const url=`${PUB}/dahua/products/${slug}.webp?v=${Date.now()}`;
  const r=await c.query('update products set "coverImageUrl"=$1,"updatedAt"=now() where slug=$2',[url,slug]);
  if(r.rowCount) upd++; else nodb++;
}
console.log('photos copied:',files.length,'| db updated:',upd,'| slug-not-found:',nodb);
const {rows}=await c.query(`select count(*) t, count("coverImageUrl") img from products where "brandId"='58545474-cbf2-4146-841e-9fc41af6d2c1'`);
console.log('Dahua now: total',rows[0].t,'with image',rows[0].img);
await c.end();
