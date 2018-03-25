'use strict';

function migrateTables(server) {
  // const ds = server.datasources.postgres;

  // const lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];

  // ds.automigrate(lbTables, (err) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(`Loopback tables [${lbTables}] were successfuly created in ${ds.adapter.name}`);
  //   ds.disconnect();
  // });
}

module.exports = migrateTables;
