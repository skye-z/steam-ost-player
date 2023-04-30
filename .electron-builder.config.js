/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const { getVersion } = await import('./other/version/getVersion.mjs');

  return {
    appId: 'cc.stacks.ostplayer',
    productName: 'Steam OST Player',
    directories: {
      output: 'dist-compile',
      buildResources: 'other/build',
    },
    files: ['dist/**', 'other/build/**'],
    extraMetadata: {
      version: getVersion(),
    },
    nsis: {
      oneClick: false,
      allowElevation: true,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: "Steam OST Player",
      runAfterFinish: false,
    },
    win: {
      artifactName: '${productName}-${platform}-${arch}-${version}.${ext}',
      target: [
        {
          target: 'nsis',
          arch: [
            'x64',
            'ia32'
          ]
        }
      ],
    }
  };
};
