
import { decrypt } from "./utils";
import { TokenProps } from "./types";

const Crypt = (token: string) => {
  const sampleToken = 'TcSUiv0UDb31Oyiy/9w+tyDcyYCwbIjhFCSufmpjFZBgKMG26O0+t3iRCc5wr1WM56mHHsnooRRERRYX40bR+RUCpTPRUyhVTj0XYHVz0ZNR6KK/wI8uQQKx+hvDdf4cm9wLoglDQ92itnpc9wHiNF+/Tao3SuWnNOKRrIuEkPLufvRIxHOdYqWCeBJJoyCZXkdO7Tj+woTkLQYkMW2bd2rerrgR705W+4aKgu0XWet6KEFtfBwaXNyBYVSglWjSVAxUkV+pNmAcUgmPXMTXtQ==';
  
  const decryptedToken: TokenProps = JSON.parse(decrypt(token));
  
  return decryptedToken;
}

export default Crypt;