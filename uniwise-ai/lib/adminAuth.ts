import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 403 }) }
  }
  
  return { authorized: true, session }
}
