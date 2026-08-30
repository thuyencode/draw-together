import { LogOutIcon } from "lucide-solid";
import { AlertModal } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";

interface LogOutButtonProps {
  onProceed?: () => void;
}

export function LogOutButton(props: LogOutButtonProps) {
  return (
    <AlertModal.Provider>
      <AlertModal.Trigger class="btn btn-error btn-sm btn-soft">
        {m.passwd_security_logOut()}
        <LogOutIcon class="size-4" />
      </AlertModal.Trigger>

      <AlertModal.Root>
        <AlertModal.Box>
          <AlertModal.Title>
            {m.passwd_security_logOutConfirm()}
          </AlertModal.Title>
          <AlertModal.Description>
            {m.passwd_security_logOutDescription()}
          </AlertModal.Description>

          <AlertModal.Action>
            <AlertModal.Cancel />
            <AlertModal.Proceed onClick={props.onProceed} />
          </AlertModal.Action>
        </AlertModal.Box>

        <AlertModal.Backdrop />
      </AlertModal.Root>
    </AlertModal.Provider>
  );
}
