import {
    check,
    PERMISSIONS,
    RESULTS,
    openSettings,
    request,
  } from 'react-native-permissions';
  import { Platform, Alert } from 'react-native';
  
  const permissionType = Platform.select({
    ios: [
      PERMISSIONS.IOS.MEDIA_LIBRARY,
    ],
    android: [
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ],
  });
  
  export const chechPermissionStatus = () => {
    const permissionParam = [];
    permissionType.map((item, index) => {
      permissionParam.push(check(item));
    });
  
    Promise.all(permissionParam).then((results) => {
      const permissionsToRequest = [];
      const blockedPermssions = [];
      results.map((item, index) => {
        if (item === RESULTS.DENIED) {
          permissionsToRequest.push(permissionType[index]);
        } else if (item === RESULTS.BLOCKED) {
          blockedPermssions.push(permissionType[index]);
        }
      });
      if (blockedPermssions.length > 0) {
        Alert.alert(
          'Permission Required!',
          `${Platform.OS == 'ios' ? 'Media Library' : 'Storage'} permission required to use app features. Please enable persmission from settings.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                openSettings();
              },
            },
          ],
          { cancelable: false },
        );
      } else if (permissionsToRequest.length > 0) {
        requestPermissions(permissionsToRequest).then((results) => {
          console.log(
            'PermissionManager',
            'chechPermissionStatus',
            'requestPermissions-then',
            results,
          );
        });
      }
    });
  };
  
  export const requestPermissions = async (permissionsToRequest: Array) => {
    console.log(
      'PermissionManager',
      'chechPermissionStatus',
      permissionsToRequest,
    );
    const permissionsStatus = [];
    for (let index = 0; index < permissionsToRequest.length; index++) {
      const item = permissionsToRequest[index];
  
      permissionsStatus.push(await request(item));
    }
  
    return permissionsStatus;
  };
  
  export default {
    chechPermissionStatus,
  };