/*
 * @Author: stupid cat
 * @Date: 2017-05-07 19:20:35
 * @Last Modified by: stupid cat
 * @Last Modified time: 2018-05-16 10:01:47
 *
 * This project uses the AGPLv3 license. Please read the license file before using/adapting any of the code.
 */

const Builder = require('../structures/TagBuilder');

module.exports =
    Builder.APITag('usermention')
        .withArgs(a => [a.optional('user'), a.optional('quiet')])
        .withDesc('Mentions `user`. `user` defaults to the user who executed the containing tag. ' +
            'If `quiet` is specified, if `user` can\'t be found it will simply return nothing.')
        .withExample(
            'Hello, {usermention}!',
            'Hello, @user!'
        )
        .whenArgs('0-2', async function (subtag, context, args) {
            let quiet = bu.isBoolean(context.scope.quiet) ? context.scope.quiet : !!args[1],
                user = context.user;

            if (args[0])
                user = await context.getUser(args[0], {
                    quiet, suppress: context.scope.suppressLookup,
                    label: `${context.isCC ? 'custom command' : 'tag'} \`${context.tagName || 'unknown'}\``
                });

            if (user != null) {
                if (!context.state.allowedMentions.users.includes(user.id)) {
                    context.state.allowedMentions.users.push(user.id);
                }
                return user.mention;
            }

            if (quiet)
                return '';
        })
        .whenDefault(Builder.errors.tooManyArguments)
        .build();