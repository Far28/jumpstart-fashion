import { describe, it, expect } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

describe('Supabase Integration', () => {
  it('should have supabase client configured', () => {
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
    expect(supabase.from).toBeDefined()
  })

  it('should be able to query products table', async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    // Should not throw an error (even if no data)
    expect(error).toBeNull()
  })
})
