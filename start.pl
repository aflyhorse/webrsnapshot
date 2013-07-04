#!/usr/bin/env perl
use strict;
use warnings;

# Add lib
use FindBin;                     # locate this script
use lib "$FindBin::Bin/lib";  # use the lib directory

use Mojolicious::Lite;
use ConfigReader;
use ConfigWriter;

get '/' => sub {
  my $self = shift;
  $self->render('index');
};

post '/config' => sub {
  my $self = shift;

  # Include loop to get all include patterns from the post data
  my @include = ();
  my $include_count = $self->param('include_count');
  for (my $c=0; $c<$include_count;$c++ )
  {
    my $i=0;
    while ( $self->param('include_'.$c) )
    {	
      $include[$i++] = $self->param('include_'.$c++);
    }
  }

  # Exclude loop to get all exclude patterns from the post data
  my @exclude = ();
  my $exclude_count = $self->param('exclude_count');
  for (my $c=0; $c<$exclude_count;$c++ )
  {
    my $i=0;
    while ( $self->param('exclude_'.$c) )
    {	
      $exclude[$i++] = $self->param('exclude_'.$c++);
    }
  }

  # Servers loop do get all configured server lines from the post data
  my @servers = ();
  my $servers_count = $self->param('servers_count');
  my $count = 0;
  my $servers_line_count = 0;
  for (my $c=0; $c<$servers_count;$c++)
  {
    my $server_label = $self->param('server_label_'.$c);
    # If server_label is defined, we have valid server
    if (defined $server_label)
    {
      my $server_dir_count = $self->param('server_'.$c.'_dircount');
      for (my $i=0; $i<$server_dir_count; $i++)
      {
        my $server_dir_args = $self->param('server_'.$c.'_dir_'.$i.'_args')?
          "\t\t".$self->param('server_'.$c.'_dir_'.$i.'_args') : ""; 
        $servers[$servers_line_count++] = 
        $self->param('server_'.$c.'_dir_'.$i.'_dir')."\t\t".$server_label."/".$server_dir_args;
      }
    }
  }

  # TODO
  # Scripts loop
  my @scripts = ();
  my $scripts_count = 0;

  # And send everything to the ConfigWriter
  ConfigWriter::saveConfig(
    # Extra Parameter
    scalar @include,
    scalar @exclude,
    $servers_line_count,
    $scripts_count,
    # Tab 1 - Root	
    $self->param('config_version'),
    $self->param('snapshot_root' ),
    $self->param('no_create_root')?     $self->param('no_create_root') : "off",
    # Tab 2 - Commands
    $self->param('cmd_cp')?             $self->param('cmd_cp') : "",
    $self->param('cmd_rm')?             $self->param('cmd_rm') : "",
    $self->param('cmd_rsync'),
    $self->param('cmd_ssh')?            $self->param('cmd_ssh')            : "",
    $self->param('cmd_logger')?         $self->param('cmd_logger')         : "",
    $self->param('cmd_du')?             $self->param('cmd_du')             : "",
    $self->param('cmd_rsnapshot_diff')? $self->param('cmd_rsnapshot_diff') : "",
    $self->param('cmd_preexec')?        $self->param('cmd_preexec')        : "",
    $self->param('cmd_postexec')?       $self->param('cmd_postexec')       : "",
    # Tab 4 - Backup Intervals
    $self->param('retain_hourly')?      $self->param('retain_hourly')  : "",
    $self->param('retain_daily')?       $self->param('retain_daily')   : "",
    $self->param('retain_weekly')?      $self->param('retain_weekly')  : "",
    $self->param('retain_monthly')?     $self->param('retain_monthly') : "",
    # Tab 3 - Global Config
    $self->param('verbose')?          $self->param('verbose')          : "",
    $self->param('loglevel')?         $self->param('loglevel')         : "",
    $self->param('logfile')?          $self->param('logfile')          : "",
    $self->param('lockfile')?         $self->param('lockfile')         : "",
    $self->param('rsync_short_args')? $self->param('rsync_short_args') : "",
    $self->param('rsync_long_args')?  $self->param('rsync_long_args')  : "",
    $self->param('ssh_args')?         $self->param('ssh_args')         : "",
    $self->param('du_args')?          $self->param('du_args')          : "",
    $self->param('one_fs')?           $self->param('one_fs')           : "off",
    $self->param('link_dest')?        $self->param('link_dest')        : "off",
    $self->param('sync_first')?       $self->param('sync_first')       : "off",
    $self->param('use_lazy_deletes')? $self->param('use_lazy_deletes') : "off",
    $self->param('rsync_numtries')?   $self->param('rsync_numtries')   : "",
    # Tab 5 - Include/Exclude
    $self->param('include_file')? $self->param('include_file') : "",
    $self->param('exclude_file')? $self->param('exclude_file') : "",
    @include? @include : (""),
    @exclude? @exclude : (""),
    # Tab 6 - Servers
    @servers? @servers : (""),
    # Tab 7 - Scripts
    @scripts? @scripts : (""),
  );
  $self->flash(saved=>'yes');
  $self->redirect_to('/config');
};

# Load Config
get '/config' => sub {
  my $self = shift;
  # Create object from the Config File
  my $parser = new ConfigReader;
  # Tab 1 - Root
  $self->stash(config_version => $parser->getConfigVersion() );
  $self->stash(snapshot_root  => $parser->getSnapshotRoot()  );
  $self->stash(no_create_root => $parser->getNoCreateRoot()  );
  # Tab 2 - Commands
  $self->stash(cmd_cp             => $parser->getCmCp()     );
  $self->stash(cmd_rm             => $parser->getCmRm()     );
  $self->stash(cmd_rsync          => $parser->getCmRsync()  );
  $self->stash(cmd_ssh            => $parser->getCmSsh()    );
  $self->stash(cmd_logger         => $parser->getCmLogger() );
  $self->stash(cmd_du             => $parser->getCmDu()     );
  $self->stash(cmd_rsnapshot_diff => $parser->getCmDiff()   );
  $self->stash(cmd_preexec        => $parser->getPreExec()  );
  $self->stash(cmd_postexec       => $parser->getPostExec() );
  # Tab 3 - Global Config
  $self->stash(verbose          => $parser->getVerbose()        );
  $self->stash(loglevel         => $parser->getLogLevel()       );
  $self->stash(logfile          => $parser->getLogFile()        );
  $self->stash(lockfile         => $parser->getLockFile()       );
  $self->stash(rsync_short_args => $parser->getRsyncShortArgs() );
  $self->stash(rsync_long_args  => $parser->getRsyncLongArgs()  );
  $self->stash(ssh_args         => $parser->getSshArgs()        );
  $self->stash(du_args          => $parser->getDuArgs()         );
  $self->stash(one_fs           => $parser->getOneFs()          );
  $self->stash(link_dest        => $parser->getLinkDest()       );
  $self->stash(sync_first       => $parser->getSyncFirst()      );
  $self->stash(use_lazy_deletes => $parser->getUseLazyDeletes() );
  $self->stash(rsync_numtries   => $parser->getRsyncNumtries()  );
  # Tab 4 - Backup Intervals
  $self->stash(interval_hourly  => $parser->getIntervalHourly()  );
  $self->stash(interval_daily   => $parser->getIntervalDaily()   );
  $self->stash(interval_weekly  => $parser->getIntervalWeekly()  );
  $self->stash(interval_monthly => $parser->getIntervalMonthly() );
  # Tab 5 - Include/Exclude
  $self->stash(include_file => $parser->getIncludeFile() );
  $self->stash(exclude_file => $parser->getExcludeFile() );
  $self->stash(include      => [ $parser->getInclude()  ]);
  $self->stash(exclude      => [ $parser->getExclude()  ]);
  # Tab 6 - Servers
  $self->stash(backup_servers => [ $parser->getServers() ]);
  # Tab 7 - Scripts
  $self->stash(backup_scripts => [ $parser->getScripts() ]);
  # And render the web interface
  $self->render('config');

  # Object have to be destroyed, to not show the config from the first read
 $parser->DESTROY();
};

app->start;