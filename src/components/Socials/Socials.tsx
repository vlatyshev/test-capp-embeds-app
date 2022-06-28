import { GIT_HUB_URL } from 'constants/socials';

import { GitHubIcon } from 'icons/github';

import styles from './Socials.module.css';

const SOCIALS = [
    { name: 'GitHub', href: GIT_HUB_URL, Icon: GitHubIcon },
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
