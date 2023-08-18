import { getAuth } from 'firebase/auth';
import { firebaseApp } from 'src/plugins/firebase';
import { login, logout } from 'src/plugins/firebase/auth';
import { useAuthContext } from 'src/plugins/firebase/contexts/AuthContext';


export const LoginButton = () => {
  const auth = useAuthContext()

  if (!auth.currentUser) {
    return (
      <div className="font-bold text-lg mb-4">
        <button className="rounded-xl bg-slate-200 py-2 px-3"
          onClick={async () => {
            login()
            const auth = getAuth(firebaseApp);
            console.log(auth.currentUser)
          }}
        >
          Google Login
        </button>
      </div>
    )
  } else {
    return (
      <div className="font-bold text-lg mb-4">
        <button className="rounded-xl bg-slate-200 py-2 px-3"
          onClick={async () => {
            logout()
            const auth = getAuth(firebaseApp);
            console.log(auth.currentUser)
          }}
        >
          <div className="flex items-center gap-1">
            {/* <img
              src={auth.currentUser.photoURL ?? ''}
              className="rounded-full w-10 h-10"
            /> */}
            {
              auth.currentUser.email
            }
          </div>
        </button>
      </div>
    )
  }
}
