import { FaGithub } from 'react-icons/fa';
import { GIT_HUB_URL } from 'constants/socials';

import styles from './Socials.module.css';

const SOCIALS = [
    { name: 'GitHub', href: GIT_HUB_URL, Icon: FaGithub },
];

export const Socials = () => (
    <div className={styles.socialsContainer}>
        {SOCIALS.map(({ name, href, Icon }) => (
            <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialCard}
            >
                <Icon className={styles.socialIcon} />
            </a>
        ))}
    </div>
);
