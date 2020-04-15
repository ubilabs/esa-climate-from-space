import {PresenterIcon} from '../icons/presenter-icon';
import {LanguageIcon} from '../icons/language-icon';
import {ShareIcon} from '../icons/share-icon';
import {InfoIcon} from '../icons/info-icon';
import {ExportIcon} from '../icons/export-icon';

import {MenuItem} from '../../types/menu-item';

export const menuItems: MenuItem[] = [
  {
    id: 'modes',
    icon: PresenterIcon,
    subItems: [
      {
        id: 'presenterMode',
        link: '/present'
      },
      {
        id: 'showcaseMode',
        link: '/showcase'
      }
    ]
  },
  {
    id: 'language',
    icon: LanguageIcon
  },
  {
    id: 'share',
    icon: ShareIcon,
    subItems: [
      {
        id: 'twitter'
      },
      {
        id: 'facebook'
      },
      {
        id: 'whatsApp'
      },
      {
        id: 'copyLink'
      }
    ]
  },
  {
    id: 'info',
    icon: InfoIcon,
    subItems: [
      {
        id: 'presenterMode',
        link: '/present'
      },
      {
        id: 'showcaseMode',
        link: '/showcase'
      }
    ]
  },
  {
    id: 'export',
    icon: ExportIcon,
    subItems: [
      {
        id: 'presenterMode',
        link: '/present'
      },
      {
        id: 'showcaseMode',
        link: '/showcase'
      }
    ]
  }
];
