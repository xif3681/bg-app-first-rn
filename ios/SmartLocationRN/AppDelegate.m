/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <AMapFoundationKit/AMapFoundationKit.h>
#import "RNUMConfigure.h"
#import <UMPush/UMessage.h>
#import <React/RCTLinkingManager.h>

@interface AppDelegate () <UNUserNotificationCenterDelegate, RCTBridgeDelegate>

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"SmartLocationRN"
                                            initialProperties:nil];

  rootView.backgroundColor = [UIColor whiteColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
#if DEBUG
  AMapServices.sharedServices.apiKey = @"d200c32a5d1f90d2bbd6e1a034d20959"; /// com.pagoda.dataTec.RN.smartLocation
#else
  AMapServices.sharedServices.apiKey = @"fbbc77c5724302ac589c82fd72054708"; /// com.wkzq.quickBI
#endif
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [UMConfigure setLogEnabled:YES];
  [RNUMConfigure initWithAppkey:@"5cefd0613fc1953b150011c3" channel:nil];
  // Push组件基本功能配置
  UMessageRegisterEntity *entity = [[UMessageRegisterEntity alloc] init];
  //type是对推送的几个参数的选择，可以选择一个或者多个。默认是三个全部打开，即：声音，弹窗，角标
  entity.types = UMessageAuthorizationOptionBadge|UMessageAuthorizationOptionSound|UMessageAuthorizationOptionAlert;
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  [UMessage registerForRemoteNotificationsWithLaunchOptions:launchOptions Entity:entity completionHandler:^(BOOL granted, NSError * _Nullable error) {
    NSLog(@"registerForRemoteNotificationsWithLaunchOptions error: %@", error);
    if (granted) {}else{}
  }];
  
  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [UMessage registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"didFailToRegisterForRemoteNotificationsWithError: %@", error);
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

//iOS10以下使用这两个方法接收通知
-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [UMessage setAutoAlert:NO];
  if([[[UIDevice currentDevice] systemVersion]intValue] < 10){
    [UMessage didReceiveRemoteNotification:userInfo];
  }
  completionHandler(UIBackgroundFetchResultNewData);
}
//iOS10新增：处理前台收到通知的代理方法
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [UMessage setAutoAlert:NO];
    //应用处于前台时的远程推送接受
    //必须加这句代码
    [UMessage didReceiveRemoteNotification:userInfo];
  }else{
    //应用处于前台时的本地推送接受
  }
  completionHandler(UNNotificationPresentationOptionSound|UNNotificationPresentationOptionBadge|UNNotificationPresentationOptionAlert);
}
//iOS10新增：处理后台点击通知的代理方法
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler{
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    //应用处于后台时的远程推送接受
    //必须加这句代码
    [UMessage didReceiveRemoteNotification:userInfo];
  }else{
    //应用处于后台时的本地推送接受
  }
}

@end
