import { supabase } from '../../lib/supabase'
import { Button } from './Button'

export function SignOutButton() {
  return (
    <Button 
      variant="danger"
      onClick={() => supabase.auth.signOut()}
    >
      Sign Out
    </Button>
  )
}