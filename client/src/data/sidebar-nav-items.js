export default function() {
  return [
    {
      title: "Home",
      to: "/home",
      htmlBefore: '<i class="material-icons">home</i>',
      htmlAfter: "",
    },
    {
      title: "Admin Dashboard",
      htmlBefore: '<i class="material-icons">admin_panel_settings</i>',
      to: "/admin",
    },
    {
      title: "Pet Owner",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/pet-owner",
    },
    {
      title: "Care Taker",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/care-taker",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite",
    },
    {
      title: "Forms & Components",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/components-overview",
    },
    {
      title: "Tables",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/tables",
    },
    {
      title: "Errors",
      htmlBefore: '<i class="material-icons">error</i>',
      to: "/errors",
    },
    
  ];
}
