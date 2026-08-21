'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">AI Resume Optimizer</Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/" className={pathname === '/' ? styles.active : ''}>
            Optimizer
          </Link>
        </li>
        <li>
          <Link href="/creator" className={pathname === '/creator' ? styles.active : ''}>
            Creator
          </Link>
        </li>
        <li>
          <Link href="/profile" className={pathname === '/profile' ? styles.active : ''}>
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}
