import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function GET() {
  const startTime = performance.now();
  const requestHeaders = headers();
  const requestId = requestHeaders.get('x-request-id') || `req-${Date.now()}`;
  
  try {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] [${requestId}] Revalidation request received`);
    
    revalidatePath('/');
    
    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);
    
    console.info(`[${timestamp}] [${requestId}] Revalidation completed successfully in ${executionTime}ms`);
    
    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Page revalidation completed successfully',
        metadata: {
          timestamp,
          requestId,
          executionTimeMs: executionTime,
          revalidatedPaths: ['/']
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
    
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${requestId}] Revalidation failed: ${error.message}`);
    console.error(`[${timestamp}] [${requestId}] Error stack: ${error.stack}`);
    
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Revalidation failed',
        error: {
          name: error.name,
          message: error.message,
          timestamp,
          requestId
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
