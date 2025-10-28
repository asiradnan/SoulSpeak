import dotenv from 'dotenv';
dotenv.config();

console.log('\n🔍 Environment Variables Check:\n');
console.log('EMAIL:', process.env.EMAIL ? '✅ Set' : '❌ Not set');
console.log('EMAIL value:', process.env.EMAIL);
console.log('\nEMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
console.log('EMAIL_PASS has spaces:', process.env.EMAIL_PASS?.includes(' ') ? '⚠️  YES (REMOVE SPACES!)' : '✅ No spaces');
console.log('\nFRONTEND_URL:', process.env.FRONTEND_URL || '❌ Not set (will default to localhost)');
console.log('BACKEND_URL:', process.env.BACKEND_URL || '❌ Not set (will default to localhost)');
console.log('\nJWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Not set');
console.log('\n');
