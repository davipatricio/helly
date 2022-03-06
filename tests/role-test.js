// @ts-nocheck
const { Events, Role } = require('../build/cjs/index');
 
module.exports.startRoleTests = (client) => {
    client.on(Events.Ready, () => {
        const role = client.caches.roles.get('912013404259102750');
        if (!role) throw new Error('Role not found.');
        if (!(role instanceof Role)) throw new Error('Role is not instance of Role.');

        if (role.id !== '912013404259102750') throw new Error('Role ID is not equal to \'912013404259102750\'.');
        if (role.name !== 'Bots') throw new Error('Role name is not equal to \'Bots\'.');
        if (role.guild.id !== '542107745785217065') throw new Error('Role guild ID is not equal to \'542107745785217065\'.');

        console.log('   [Role Tests] ✅ Role tests passed.')
    })
}