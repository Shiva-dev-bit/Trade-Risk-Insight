import { ClientOnly } from './client'
 
// export function generateStaticParams() {
//   return [
//     { slug: [''] },
    
//   ];
// }
 
export default function Page() {
  return <ClientOnly />
}

// export function generateStaticParams() {
//   return [
//     { slug: [''] },
//     { slug: ['auth', 'sign-in'] },
//   ];
// }