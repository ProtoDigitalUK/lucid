import T from "@/translations";
import { Component } from "solid-js";
// Services
import api from "@/services/api";
// Components
import Panel from "@/components/Groups/Panel";

interface UpdateRoleProps {
  id: number;
  open: boolean;
  setOpen: (_state: boolean) => void;
}

const UpdateRole: Component<UpdateRoleProps> = (props) => {
  // ---------------------------------
  // Query
  const role = api.roles.useGetSingle({
    queryParams: {
      location: {
        role_id: props.id,
      },
    },
    enabled: () => props.open,
  });

  // ---------------------------------
  // Return
  return (
    <Panel.Root
      state={{
        open: props.open,
        setOpen: props.setOpen,
        isLoading: role.isLoading,
        isError: role.isError,
      }}
      content={{
        title: T("update_role_panel_title", {
          name: role.data?.data.name || "",
        }),
        description: T("update_role_panel_description", {
          name: role.data?.data.name || "",
        }),
      }}
      footer={<>footer</>}
    >
      Laboris incididunt commodo aliqua nisi minim et occaecat qui voluptate
      proident magna aute. Laboris enim cillum adipisicing ea magna in duis
      adipisicing. Cupidatat duis sit minim tempor nisi qui. Ea aliquip laborum
      fugiat non consequat aute adipisicing nisi cillum ut. Amet officia
      incididunt laborum eiusmod. Dolor incididunt officia pariatur adipisicing
      esse irure sunt reprehenderit ipsum do occaecat eu. Magna consequat ea
      fugiat cillum culpa nisi incididunt pariatur sunt ipsum reprehenderit. Do
      reprehenderit enim ullamco sit adipisicing consequat mollit dolor amet
      nostrud consectetur sint laborum Lorem. Proident laboris duis nisi
      consequat irure pariatur minim adipisicing ea eu laboris laborum dolor
      elit. Aliqua quis proident est in consequat tempor. In commodo aliquip
      fugiat cillum aute deserunt laborum culpa exercitation laborum Lorem anim.
      Nisi nisi incididunt eu exercitation. Labore cillum minim occaecat
      consequat occaecat enim Lorem cillum aute ex laboris ea aliquip fugiat.
      Excepteur consectetur elit deserunt occaecat cupidatat ex exercitation
      dolor culpa ut consectetur. Mollit mollit non incididunt nostrud consequat
      deserunt nisi incididunt minim cillum eiusmod enim. Et exercitation
      laboris ut elit fugiat aliquip dolore reprehenderit occaecat. Amet et ex
      ea consequat aute adipisicing aliqua pariatur magna consectetur aliquip.
      Dolore eiusmod ea ea quis commodo magna dolore officia duis commodo. Quis
      ut consequat nisi est amet aute incididunt proident enim exercitation. Ut
      nisi id non veniam fugiat. Irure ut ipsum ea quis cupidatat cupidatat. Id
      fugiat nostrud labore sit eiusmod. Aute elit laboris consequat aliquip
      consectetur. Esse sunt nostrud velit velit culpa deserunt excepteur
      proident. Occaecat in eu eiusmod in culpa tempor elit nostrud ut et nisi
      commodo aliqua. Magna nulla eu laboris nisi nisi tempor sint nulla culpa
      commodo dolore cupidatat voluptate consequat. Id voluptate cupidatat quis
      aliquip fugiat mollit Lorem occaecat excepteur. Et fugiat culpa sunt Lorem
      ad consequat nostrud exercitation et voluptate minim voluptate velit sit.
      Excepteur duis ex et est eu elit pariatur duis laboris ut ipsum elit anim
      magna. Cillum et sunt cupidatat laboris do. Voluptate velit velit ad
      fugiat. Pariatur minim amet sit qui id officia eiusmod exercitation veniam
      nisi eiusmod et. Amet ex duis duis fugiat velit voluptate officia mollit
      qui elit. Nulla quis ad laboris Lorem proident elit incididunt. Nostrud
      velit anim minim cupidatat velit. Reprehenderit veniam eiusmod eiusmod
      consectetur sit ea velit exercitation duis aliquip laborum elit
      incididunt. Duis amet elit qui ipsum eiusmod. Pariatur cillum velit do est
      do officia officia nulla sit incididunt pariatur mollit mollit. Irure
      Lorem eu exercitation deserunt ad aute nostrud aliqua dolore do sint
      proident sit. Qui eu eu dolore eu tempor elit et. Adipisicing nisi non
      incididunt quis qui ipsum do. Id est esse ipsum proident aute fugiat velit
      laboris labore sunt. Esse nisi eu et culpa occaecat qui labore ex. Quis
      tempor in ex excepteur consequat nisi esse magna minim ex aliqua esse est.
      Excepteur sunt exercitation sit minim fugiat est irure irure nostrud. Enim
      velit magna est laboris ut exercitation consequat ea proident ad deserunt
      deserunt ea. Cupidatat cillum tempor ut et Lorem ipsum proident aliqua
      pariatur cillum. Proident ad laboris non ea consectetur deserunt aliqua
      duis nostrud occaecat occaecat irure enim nostrud.
    </Panel.Root>
  );
};

export default UpdateRole;
