'use client'

import { useEffect, useState } from "react";
import { decrypt, encrypt } from "./utils";
import { TokenProps } from "./types";

interface CryptoProps {
  token: string;
}

function Crypt({ token }: CryptoProps) {
  const [tokenObj, setTokenObj] = useState<TokenProps>()
  console.log(token);
  const sampleToken = 'TcSUiv0UDb31Oyiy/9w+tyDcyYCwbIjhFCSufmpjFZBgKMG26O0+t3iRCc5wr1WM56mHHsnooRRERRYX40bR+RUCpTPRUyhVTj0XYHVz0ZNR6KK/wI8uQQKx+hvDdf4cm9wLoglDQ92itnpc9wHiNF+/Tao3SuWnNOKRrIuEkPLufvRIxHOdYqWCeBJJoyCZXkdO7Tj+woTkLQYkMW2bd2rerrgR705W+4aKgu0XWet6KEFtfBwaXNyBYVSglWjSVAxUkV+pNmAcUgmPXMTXtQ=='

  //const ee = encrypt(token)
  useEffect(()=>{
    const dd: TokenProps = JSON.parse(decrypt(sampleToken))
    setTokenObj(dd)
    console.log(dd.CandidateID);
  }, [])
  
  return (
    <div>
      { 'Cadidate ID: '}
    </div>
  );
}

export default Crypt;