const https = require('https');
const http = require('http');

const CONFIG = {
  pexels: { apiKey: 'yfvrKV4rYjXI3AO258ylNiDVhXKVE3b7ZGDbrC5ypncejb5uc7nbm8jl', baseUrl: 'https://api.pexels.com/v1' },
  cloudinary: { cloudName: 'duap0qf04', apiKey: '586967624379824', baseUrl: 'https://api.cloudinary.com/v1_1/duap0qf04' },
  tinypng: { apiKey: 'qRPkWlZvJpBq0F7ccbBLvzJ79BTsZSL8', baseUrl: 'https://api.tinypng.com/shrink' },
  github: { owner: 'noshtours', repo: 'Noshtours', branch: 'staged', imagePath: 'images' },
  googleSheets: { spreadsheetId: '1YgR6HQEt6T07dc9HmcaLG-jOdAQ4ohaNBQ9mrA1PG3k', worksheetIndex: 0 }
};

const IMAGES = [
  {name:'india-nepal-card.jpg',search:'nepal mountains landscape',w:800,h:600,kb:120,type:'destination'},
  {name:'india-sikkim-card.jpg',search:'sikkim india mountains',w:800,h:600,kb:120,type:'destination'},
  {name:'india-tamilnadu-card.jpg',search:'tamil nadu temple ancient',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-bali-card.jpg',search:'bali rice terraces landscape',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-thailand-card.jpg',search:'thailand beach islands tropical',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-malaysia-card.jpg',search:'kuala lumpur petronas towers',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-vietnam-card.jpg',search:'vietnam halong bay boats',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-singapore-card.jpg',search:'singapore skyline night city',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-maldives-card.jpg',search:'maldives overwater bungalow',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-srilanka-card.jpg',search:'sri lanka tea plantations hills',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-kazakhstan-card.jpg',search:'kazakhstan steppe landscape',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-uzbekistan-card.jpg',search:'samarkand silk road ancient',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-japan-card.jpg',search:'mount fuji cherry blossoms',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-switzerland-card.jpg',search:'matterhorn zermatt alpine',w:800,h:600,kb:120,type:'destination'},
  {name:'intl-italy-card.jpg',search:'amalfi coast italy scenic',w:800,h:600,kb:120,type:'destination'},
  {name:'hero-international.jpg',search:'world travel destinations',w:1600,h:900,kb:250,type:'hero'},
  {name:'hero-wellness.jpg',search:'spa yoga meditation nature',w:1600,h:900,kb:250,type:'hero'},
  {name:'wellness-ayurveda.jpg',search:'ayurveda oil massage spa',w:800,h:600,kb:120,type:'wellness'},
  {name:'wellness-bali.jpg',search:'bali spa resort tropical',w:800,h:600,kb:120,type:'wellness'},
  {name:'wellness-thailand.jpg',search:'thai massage wellness relax',w:800,h:600,kb:120,type:'wellness'},
  {name:'wellness-rishikesh.jpg',search:'yoga meditation retreat',w:800,h:600,kb:120,type:'wellness'},
  {name:'blog-bts.jpg',search:'behind scenes photography',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-destinations.jpg',search:'travel destinations world',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-founder.jpg',search:'entrepreneur travel portrait',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-stay.jpg',search:'luxury travel accommodation',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-behind-scenes.jpg',search:'travel agency team working',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-community.jpg',search:'community travel adventure',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-community-2.jpg',search:'travel friends adventure',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-philosophy.jpg',search:'travel philosophy journey',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-philosophy-2.jpg',search:'mindful travel exploration',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-final.jpg',search:'adventure lifestyle travel',w:1200,h:600,kb:150,type:'blog'},
  {name:'blog-final-2.jpg',search:'travel experience memories',w:1200,h:600,kb:150,type:'blog'}
];

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({status: res.statusCode, body: JSON.parse(body), raw: body}); }
        catch (e) { resolve({status: res.statusCode, body: body, raw: body}); }
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function fetchFromPexels(searchTerm) {
  const options = {hostname:'api.pexels.com',path:`/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=1&size=large`,method:'GET',headers:{'Authorization':CONFIG.pexels.apiKey},protocol:'https:'};
  const res = await makeRequest(options);
  if (res.status !== 200 || !res.body.photos || res.body.photos.length === 0) throw new Error(`Pexels: No image for "${searchTerm}"`);
  const photo = res.body.photos[0];
  return {url:photo.src.large,photographer:photo.photographer,photographerUrl:photo.photographer_url||'https://www.pexels.com'};
}

async function resizeWithCloudinary(imageUrl, width, height) {
  const options = {hostname:'api.cloudinary.com',path:`/v1_1/${CONFIG.cloudinary.cloudName}/image/upload`,method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},auth:`${CONFIG.cloudinary.cloudName}:${CONFIG.cloudinary.apiKey}`,protocol:'https:'};
  const params = new URLSearchParams({file:imageUrl,width:width,height:height,crop:'fill',gravity:'auto',quality:'auto'});
  const res = await makeRequest(options, params.toString());
  if (res.status !== 200) throw new Error(`Cloudinary: Upload failed`);
  return {url:res.body.secure_url,size:res.body.bytes||0};
}

async function compressWithTinyPNG(imageUrl) {
  const options = {hostname:'api.tinypng.com',path:'/shrink',method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},auth:`api:${CONFIG.tinypng.apiKey}`,protocol:'https:'};
  const params = new URLSearchParams({'source.url':imageUrl});
  const res = await makeRequest(options, params.toString());
  if (res.status !== 201) throw new Error(`TinyPNG: Compression failed`);
  const downloadUrl = res.body.output.url;
  const downloadRes = await makeRequest({hostname:new URL(downloadUrl).hostname,path:new URL(downloadUrl).pathname,method:'GET',protocol:'https:'});
  return {base64:Buffer.from(downloadRes.raw,'binary').toString('base64'),size:res.body.output.size||0};
}

async function uploadToGitHub(githubToken, filename, fileContent, commitMessage) {
  const path = `/${CONFIG.github.imagePath}/${filename}`;
  const options = {hostname:'api.github.com',path:`/repos/${CONFIG.github.owner}/${CONFIG.github.repo}/contents${path}`,method:'PUT',headers:{'Authorization':`token ${githubToken}`,'Content-Type':'application/json','User-Agent':'Nosh-Automation'},protocol:'https:'};
  const data = {message:commitMessage,content:fileContent,branch:CONFIG.github.branch};
  const res = await makeRequest(options, data);
  if (res.status !== 201 && res.status !== 200) throw new Error(`GitHub: Upload failed (${res.status})`);
  return {url:`https://raw.githubusercontent.com/${CONFIG.github.owner}/${CONFIG.github.repo}/${CONFIG.github.branch}${path}`,commitSha:res.body.commit?.sha||'unknown'};
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  
  const {githubToken, action} = req.body;
  if (!githubToken) return res.status(400).json({error:'GitHub token required'});
  if (action !== 'process') return res.status(400).json({error:'Invalid action'});
  
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({status:'started',timestamp:new Date().toISOString()})+'\n');
  
  const results = [];
  let totalSize = 0;
  
  try {
    for (let i = 0; i < IMAGES.length; i++) {
      const img = IMAGES[i];
      const progress = {index:i+1,total:IMAGES.length,name:img.name,steps:[]};
      try {
        progress.steps.push('Fetching from Pexels...');
        res.write(JSON.stringify({progress})+'\n');
        const pexelsRes = await fetchFromPexels(img.search);
        progress.steps.push(`✓ Pexels OK`);
        progress.steps.push('Resizing with Cloudinary...');
        res.write(JSON.stringify({progress})+'\n');
        const cloudinaryRes = await resizeWithCloudinary(pexelsRes.url, img.w, img.h);
        progress.steps.push(`✓ Resized`);
        progress.steps.push('Compressing with TinyPNG...');
        res.write(JSON.stringify({progress})+'\n');
        const tinypngRes = await compressWithTinyPNG(cloudinaryRes.url);
        const finalSize = tinypngRes.size;
        totalSize += finalSize;
        progress.steps.push(`✓ Compressed`);
        progress.steps.push('Uploading to GitHub...');
        res.write(JSON.stringify({progress})+'\n');
        const githubRes = await uploadToGitHub(githubToken, img.name, tinypngRes.base64, `Add ${img.name} via 31-images batch`);
        progress.steps.push(`✓ GitHub OK`);
        results.push({index:i+1,filename:img.name,type:img.type,finalSize:finalSize,finalSizeKB:(finalSize/1024).toFixed(2),githubUrl:githubRes.url,status:'success',timestamp:new Date().toISOString()});
        progress.steps.push('✓ Complete');
        progress.status = 'success';
      } catch (err) {
        progress.steps.push(`✗ ${err.message}`);
        progress.status = 'error';
        results.push({index:i+1,filename:img.name,status:'failed',error:err.message,timestamp:new Date().toISOString()});
      }
      res.write(JSON.stringify({progress})+'\n');
    }
    
    const manifest = {batch_id:new Date().toISOString(),total_images:IMAGES.length,successful:results.filter(r=>r.status==='success').length,failed:results.filter(r=>r.status==='failed').length,total_size_mb:(totalSize/1024/1024).toFixed(2),created_at:new Date().toISOString(),images:results.filter(r=>r.status==='success')};
    await uploadToGitHub(githubToken,'manifest.json',Buffer.from(JSON.stringify(manifest,null,2)).toString('base64'),`Add manifest for batch ${new Date().toISOString().split('T')[0]}`);
    
    res.write(JSON.stringify({status:'complete',summary:{total:results.length,successful:results.filter(r=>r.status==='success').length,failed:results.filter(r=>r.status==='failed').length,totalSizeMB:(totalSize/1024/1024).toFixed(2),completedAt:new Date().toISOString()},results:results})+'\n');
  } catch (err) {
    res.write(JSON.stringify({status:'error',error:err.message,timestamp:new Date().toISOString()})+'\n');
  }
  res.end();
};
