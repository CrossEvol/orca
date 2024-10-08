import { usePathname, useSearchParams } from 'next/navigation';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { useSelector } from 'react-redux';
import { UserRole } from '../../../constants';
import { RootState } from '../../../store';
import { ButtonLink, Divider, Spacing, Text } from '../../ui';
import {
  AccountColorfulIcon,
  CommunityColorfulIcon,
  HouseColorfulIcon,
  PeopleColorfulIcon,
  ShieldColorfulIcon,
} from '../../ui/icons';
import { LI, Root, UL } from './style';

interface SettingsSidebarProps {
  isOpen: boolean;
}

const SettingsSidebar: ForwardRefRenderFunction<HTMLDivElement, SettingsSidebarProps> = ({ isOpen }, ref) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authUser = useSelector((state: RootState) => state.auth.user);

  return (
    <Root ref={ref} isOpen={isOpen}>
      <UL>
        <LI hideOnDesktop>
          <ButtonLink fullWidth radius="none" href="/" color="text" active={pathname === '/'} size="sm">
            <HouseColorfulIcon width="24" />
            <Spacing right="xs" />
            Home
          </ButtonLink>
        </LI>
        <LI>
          <ButtonLink
            fullWidth
            radius="none"
            href="/settings/account"
            color="text"
            // active={router.query.name === 'account'}
            active={searchParams.get('name') === 'account'}
            size="sm"
          >
            <AccountColorfulIcon width="24" />
            <Spacing right="xs" />
            Account
          </ButtonLink>
        </LI>
        <LI>
          <ButtonLink
            fullWidth
            radius="none"
            href="/settings/authentication"
            color="text"
            active={searchParams.get('name') === 'authentication'}
            // active={router.query.name === 'authentication'}
            size="sm"
          >
            <ShieldColorfulIcon width="24" />
            <Spacing right="xs" />
            Authentication
          </ButtonLink>
        </LI>

        <Divider spacing="xs" />

        {authUser.role === UserRole.Admin ||
          (authUser.role === UserRole.SuperAdmin && (
            <>
              <LI noHover>
                <Spacing left="xs" top="xs" bottom="xs">
                  <Text color="textSecondary">Admin</Text>
                </Spacing>
              </LI>
              <LI>
                <ButtonLink
                  fullWidth
                  radius="none"
                  href="/settings/community"
                  color="text"
                  active={searchParams.get('name') === 'community'}
                  size="sm"
                >
                  <CommunityColorfulIcon width="24" />
                  <Spacing right="xs" />
                  Community
                </ButtonLink>
              </LI>
            </>
          ))}
        {authUser.role === UserRole.SuperAdmin && (
          <LI>
            <ButtonLink
              fullWidth
              radius="none"
              href="/settings/users"
              color="text"
              active={searchParams.get('name') === 'users'}
              size="sm"
            >
              <PeopleColorfulIcon width="24" />
              <Spacing right="xs" />
              Users
            </ButtonLink>
          </LI>
        )}
      </UL>
    </Root>
  );
};

export default forwardRef(SettingsSidebar);
